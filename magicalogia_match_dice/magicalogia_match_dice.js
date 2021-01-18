/* https://github.com/kibkibe/roll20-api-scripts/tree/master/magicalogia_match_dice */
/* (magicalogia_match_dice.js) 201227 코드 시작 */
on("ready", function() {
    on("add:graphic", function(obj) {
        try {
            if (obj.get('subtype') == 'card') {
                let deck = findObjs({ _type: 'deck', name: 'Dice'})[0];
                let model = findObjs({ _type: "card", _deckid: deck.get('_id'), _id:obj.get('_cardid')})[0];
                if (model) {
                    let areas = getPlotAreas();
                    if (!areas) {
                        return;
                    }
                    let obj_coord = {
                        left:obj.get('left')-(obj.get('width')/2),
                        top:obj.get('top')-(obj.get('height')/2),
                        width: obj.get('width'),
                        height: obj.get('height')};
                    let i=0, j=0;
                    let stacked_dice = 0;
                    let shorttest_dis = {x_dis:99999,y_dis:99999};
                    let dice = findObjs({ _type: 'graphic', _subtype: 'card', _cardid: obj.get('_cardid')});

                    for (var z=0;z<areas.length;z++) {
                        for(var x=0;x<areas[z].length;x++) {
                            let spot = areas[z][x];
                            let spot_coord = {
                                left:spot.get('left')-(spot.get('width')/2),
                                top:spot.get('top')-(spot.get('height')/2),
                                width: spot.get('width'),
                                height: spot.get('height')};
                            let current_dis = {x_dis:0, y_dis:0};
                            if (spot_coord.left < obj_coord.left && spot_coord.left+spot_coord.width > obj_coord.left) {
                                current_dis.x_dis = 0;
                            } else {
                                current_dis.x_dis = Math.min(Math.abs(spot_coord.left - obj_coord.left),
                                Math.abs(spot_coord.left+spot_coord.width-obj_coord.left-obj_coord.width));
                            }
                            if (spot_coord.top < obj.top && spot_coord.top+spot_coord.height > obj.top) {
                                current_dis.y_dis = 0;
                            } else {
                                current_dis.y_dis = Math.min(Math.abs(spot_coord.top - obj_coord.top),
                                Math.abs(spot_coord.top+spot_coord.height-obj_coord.top-obj_coord.height));
                            }
                            if (current_dis.x_dis + current_dis.y_dis < shorttest_dis.x_dis + shorttest_dis.y_dis) {
                                shorttest_dis = current_dis;
                                i=z;
                                j=x;

                                stacked_dice = 0;
                                dice.forEach(die => {
                                    if (spot_coord.left<=die.get('left')-die.get('width')/2 &&
                                        spot_coord.top<=die.get('top')-die.get('height')/2 &&
                                        spot_coord.left+spot_coord.width>=die.get('left')+die.get('width')/2 &&
                                        spot_coord.top+spot_coord.height>=die.get('top')+die.get('height')/2) {
                                        stacked_dice++;
                                    }
                                });
                                
                            }
                        }
                    }
                    let nearest_area = areas[i][j];
                    let is_area_landscape = nearest_area.get('width') > nearest_area.get('height');
                    obj.set({
                        left:Math.floor(nearest_area.get('left')-(nearest_area.get('width')/2)+(obj.get('width')/2))+(is_area_landscape?stacked_dice*obj.get('width'):0),
                        top:Math.floor(nearest_area.get('top')-(nearest_area.get('height')/2)+(obj.get('height')/2))+(!is_area_landscape?stacked_dice*obj.get('height'):0)});
                }
            }
        } catch (err) {
            sendChat('error','/w GM '+err,null,{noarchive:true});
        }
    });
});

function getPlotAreas() {

    var areas = [];
    if (findObjs({ name: 'A_delegate'}).length > 0) {
        areas.push(findObjs({ name: 'A_delegate'}));
    } else { sendChat("matchDice", "/w gm A_delegate 영역이 없습니다.",null,{noarchive:true}); return false; }
    if (findObjs({ name: 'A_observer'}).length > 0) {
        areas.push(findObjs({ name: 'A_observer'}));
    } else { sendChat("matchDice", "/w gm A_observer 영역이 없습니다.",null,{noarchive:true}); return false; }
    if (findObjs({ name: 'B_delegate'}).length > 0) {
        areas.push(findObjs({ name: 'B_delegate'}));
    } else { sendChat("matchDice", "/w gm B_delegate 영역이 없습니다.",null,{noarchive:true}); return false; }
    if (findObjs({ name: 'B_observer'}).length > 0) {
        areas.push(findObjs({ name: 'B_observer'}));
    } else { sendChat("matchDice", "/w gm B_observer 영역이 없습니다.",null,{noarchive:true}); return false; }

    return areas;
}

on("chat:message", function(msg)
{
if (msg.type == "api"){
    if (msg.content.indexOf("!match_dice") === 0) {
        try {
            let deck = findObjs({ _type: 'deck', name: 'Dice'})[0];
            if (!deck) {
                sendChat("matchDice", "/w gm Dice 덱이 Card에 없습니다.",null,{noarchive:true});
                return false;
            }
            let objects = findObjs({ _type: 'graphic', _subtype: 'card', layer: 'objects', _pageid: Campaign().get("playerpageid")});
            let areas = getPlotAreas();
            let concentrateIdx = -1;
            let dice = [[],[],[],[]];
            let flip = msg.content.includes('flip');

            for (var i=0;i<objects.length;i++) {
                let obj = objects[i];
                let model = findObjs({ _type: "card", _deckid: deck.get('_id'), _id:obj.get('_cardid')})[0];
                
                if (model) {
                    var dname = model.get('name');
                    if (flip && obj.get('currentSide')===1) {
                        let img = obj.get('sides').split('|')[0].replace('%3A',':').replace('%3F','?').replace('max','thumb').replace('med','thumb');
                        obj.set({currentSide:0,imgsrc:img});
                    }
                    if (dname === "?" && obj.get('name') == "" && obj.get('currentSide')===0) {
                        dname = "" + Math.floor( Math.random() * 6 + 1 );
                        let new_model = findObjs({ _type: "card", _deckid: deck.get('_id'), name: dname})[0];
                        obj.set("imgsrc",new_model.get('avatar').replace('max','thumb').replace('med','thumb'));
                    } 
                    if (obj.get('currentSide')===0) {
                        if (dname != "?") {
                            obj.set('name', dname);
                        }
                        let left = obj.get('left')+0;
                        let top = obj.get('top')+0;
                        let width = obj.get('width')+0;
                        let height = obj.get('height')+0;
                        let margin = 10;
                        let stop = false;
                        for (var z=0;z<areas.length;z++) {
                            for(var x=0;x<areas[z].length;x++) {
                                let area = areas[z][x];
                                if (area.get('left')-area.get('width')/2-margin<=left-width/2 &&
                                area.get('top')-area.get('height')/2-margin<=top-height/2 &&
                                area.get('top')+area.get('height')/2 +margin>= top+height/2 &&
                                area.get('left')+area.get('width')/2 +margin>= left+width/2) {
                                    if (obj.get('name') === '0') {
                                        concentrateIdx = z;
                                    }
                                    dice[z].push(obj);
                                    stop = true;
                                    break;
                                }
                            }
                            if (stop) {
                                break;
                            }
                        }
                    }
                }
        }

        if (dice[0].length < 1 && dice[2].length < 1) {
            sendChat('error','/w GM 대표 플롯 영역 내에 공개된 다이스가 없습니다.',null,{noarchive:true});
            return;
        }
            
        for (var s=0;s<dice.length;s++) {
            
            dice[s].sort(function (a, b) { 
                return a.get('name') < b.get('name') ? -1 : a.get('name') > b.get('name') ? 1 : 0;
            });
        }
        
        var match_dice = function(dice1,dice2,concentrateIdx) {
            
            for (var i=0;i<dice1.length;i++) {
                for (var j=0;j<dice2.length;j++) {
                    if (dice1[i].get('name') === '0') {
                        dice1[i].set('name',dice1[i].get('name')+'!');
                        break;
                    } else if (dice2[j].get('name') === '0') {
                        dice2[j].set('name',dice2[j].get('name')+'!');
                    } else if (dice1[i].get('name')===dice2[j].get('name') && !dice1[i].get('name').includes('!') && !dice2[j].get('name').includes('!')) {
                        if (concentrateIdx != 0) {
                        dice1[i].set('name',dice1[i].get('name')+'!');
                        }
                        if (concentrateIdx != 2) {
                        dice2[j].set('name',dice2[j].get('name')+'!');
                        }
                    }
                }
            }
        }
            
        match_dice(dice[0],dice[2],concentrateIdx); //d1 vs d2
        match_dice(dice[0],dice[3],concentrateIdx!=0?-1:0) //d1 vs o2
        match_dice(dice[2],dice[1],concentrateIdx!=2?-1:0) //d2 vs o1
        match_dice(dice[1],dice[3],-1) //o1 vs o2
        
        let style_delegate = "width:40px;height:40px;";
        let style_observer = "width:30px;height:30px;";
        let style_broken = "opacity:0.3;";
        
        let result = "";
        
        for (var i=0;i<4;i++) {
            if (dice[i].length > 0) {
                result += "<div>";
                result += (i%2==0 ? "" : "+");
                dice[i].forEach(die => {
                    result += "<img src='" + die.get('imgsrc') + "' style='";
                    result += (i%2==0 ? style_delegate :  style_observer);
                    result += (die.get('name').includes('!') ? style_broken : "") +"'>";
                });
                result += "</div>";
            }
            result += (i==1? "<div style='margin:10px 0px 10px 0px;'>vs</div>":"");
        }
        
        sendChat("",result);

    } catch (err) {
        sendChat('error','/w GM '+err,null,{noarchive:true});
    }
}}});
/* (magicalogia_match_dice.js) 201227 코드 종료 */