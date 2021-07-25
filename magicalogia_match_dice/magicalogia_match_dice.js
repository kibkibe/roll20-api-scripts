/* https://github.com/kibkibe/roll20-api-scripts/tree/master/magicalogia_match_dice */
/* (magicalogia_match_dice.js) 210505 코드 시작 */

// define: option
let md_setting = {
	// option: 다이스를 플롯 시에 자동배치 기능을 사용할지(true) 사용하지 않을지(false)의 여부를 설정합니다.
	use_snap_dice: true,
	// option: 대표 주사위의 표시 스타일(CSS)을 설정합니다.
	style_delegate: "width:40px;height:40px;",
	// option: 입회인 주사위의 표시 스타일(CSS)을 설정합니다.
	style_observer: "width:30px;height:30px;",
	// option: 대표/입회인 주사위 중 상쇄되어 파괴된 주사위의 표시 스타일(CSS)을 설정합니다.
	style_broken: "opacity:0.3;",
	// option: 매칭을 GM만 실행할 수 있게 할지 (true) 플레이어도 할 수 있게 할지 (false) 설정합니다.
	is_gm_only: true
};
// /define: option

on("ready", function() {

	// on.ready
    on("change:graphic:currentSide", function(obj,prev) {
        try {
            randomDice(obj);
        } catch (err) {
            sendChat('error','/w GM '+err,null,{noarchive:true});
        }            
    });
    on("add:graphic", function(obj) {
        try {
            if (md_setting.use_snap_dice && obj.get('subtype') == 'card') {
                let deck = findObjs({ _type: 'deck', name: 'Dice'})[0];
                let model = findObjs({ _type: "card", _deckid: deck.get('_id'), _id:obj.get('_cardid')})[0];
                if (model) {
                    state.current_plot_page = obj.get('_pageid');
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
                    let dice = findObjs({ _type: 'graphic', _subtype: 'card', gmnotes: 'Dice', _pageid: obj.get('_pageid')});
                    const margin = 10;

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
                                    if (spot_coord.left-margin<=die.get('left')-die.get('width')/2 &&
                                        spot_coord.top-margin<=die.get('top')-die.get('height')/2 &&
                                        spot_coord.left+spot_coord.width+margin>=die.get('left')+die.get('width')/2 &&
                                        spot_coord.top+spot_coord.height+margin>=die.get('top')+die.get('height')/2) {
                                        stacked_dice++;
                                    }
                                });
                            }
                        }
                    }
                    let nearest_area = areas[i][j];
                    let is_area_landscape = nearest_area.get('width') > nearest_area.get('height');
                    obj.set({
                        gmnotes:'Dice',
                        left:Math.floor(nearest_area.get('left')-(nearest_area.get('width')/2)+(obj.get('width')/2))+(is_area_landscape?stacked_dice*obj.get('width'):0),
                        top:Math.floor(nearest_area.get('top')-(nearest_area.get('height')/2)+(obj.get('height')/2))+(!is_area_landscape?stacked_dice*obj.get('height'):0),
						showname:false,showplayers_name:false});
                }
            }
        } catch (err) {
            sendChat('error','/w GM '+err,null,{noarchive:true});
        }
    });
	// /on.ready
});
on("chat:message", function(msg)
{
if (msg.type == "api"){
	// on.chat:message:api
    if (msg.content.indexOf("!match_dice") === 0 && (!md_setting.is_gm_only || (msg.playerid == 'API' || playerIsGM(msg.playerid)))) {
        try {
            let deck = findObjs({ _type: 'deck', name: 'Dice'})[0];
            if (!deck) {
                sendChat("matchDice", "/w gm Dice 덱이 Card에 없습니다.",null,{noarchive:true});
                return false;
            }
            let objects = findObjs({ _type: 'graphic', _subtype: 'card', layer: 'objects', _pageid: state.current_plot_page});
            let areas = getPlotAreas();
            let concentrateIdx = -1;
            let dice = [[],[],[],[]];
            let flip = msg.content.includes('flip');

            for (var i=0;i<objects.length;i++) {
                let obj = objects[i];
                let model = findObjs({ _type: "card", _deckid: deck.get('_id'), _id:obj.get('_cardid')})[0];
                
                if (model) {
                    var dname = model.get('name');
                    if (flip && (obj.get('currentSide') == 1 || dname == "?")) {
                        let img = obj.get('sides').split('|')[0].replace('%3A',':').replace('%3F','?').replace('max','thumb').replace('med','thumb');
                        if (dname == "?") {
                            randomDice(obj);
                        } else {
                            obj.set({currentSide:0,imgsrc:img,showname:false,showplayers_name:false});
                        }
                    }
					
					if (obj.get('currentSide') == 0) {
                        if (dname != "?") {
                            obj.set('name', dname);
                        } else {
                            obj.set('name', obj.get('name').replace('!',''));
						}
                        let left = parseInt(obj.get('left'));
                        let top = parseInt(obj.get('top'));
                        let width = parseInt(obj.get('width'));
                        let height = parseInt(obj.get('height'));
                        const margin = 10;
                        let stop = false;
                        for (var z=0;z<areas.length;z++) {
                            for(var x=0;x<areas[z].length;x++) {
                                let area = areas[z][x];
                                if (area.get('left')-area.get('width')/2-margin<=left-width/2 &&
                                area.get('top')-area.get('height')/2-margin<=top-height/2 &&
                                area.get('top')+area.get('height')/2+margin>= top+height/2 &&
                                area.get('left')+area.get('width')/2+margin>= left+width/2) {
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
                        dice1[i].set({name:dice1[i].get('name')+'!',showplayers_name:false,showname:false});
                        break;
                    } else if (dice2[j].get('name') === '0') {
                        dice2[j].set({name:dice2[j].get('name')+'!',showplayers_name:false,showname:false});
                    } else if (dice1[i].get('name')===dice2[j].get('name') && !dice1[i].get('name').includes('!') && !dice2[j].get('name').includes('!')) {
                        if (concentrateIdx != 0) {
                        dice1[i].set({name:dice1[i].get('name')+'!',showplayers_name:false,showname:false});
                        }
                        if (concentrateIdx != 2) {
                        dice2[j].set({name:dice2[j].get('name')+'!',showplayers_name:false,showname:false});
                        }
                    }
                }
            }
        }
            
        match_dice(dice[0],dice[2],concentrateIdx); //d1 vs d2
        match_dice(dice[0],dice[3],concentrateIdx!=0?-1:0) //d1 vs o2
        match_dice(dice[2],dice[1],concentrateIdx!=2?-1:0) //d2 vs o1
        match_dice(dice[1],dice[3],-1) //o1 vs o2
        
        let result = "";
        
        for (var i=0;i<4;i++) {
            if (dice[i].length > 0) {
                result += "<div>";
                result += (i%2==0 ? "" : "+");
                dice[i].forEach(die => {
                    result += "<img src='" + die.get('imgsrc') + "' style='";
                    result += (i%2==0 ? md_setting.style_delegate :  md_setting.style_observer);
                    result += (die.get('name').includes('!') ? md_setting.style_broken : "") +"'>";
                });
                result += "</div>";
            }
            result += (i==1? "<div style='margin:10px 0px 10px 0px;'>vs</div>":"");
        }
        
        sendChat("",result);

    } catch (err) {
        sendChat('error','/w GM '+err,null,{noarchive:true});
    }
}
	// /on.chat:message:api
}});

// define: global function
function randomDice(obj) {

    if (obj.get('subtype') == 'card') {
        let deck = findObjs({ _type: 'deck', name: 'Dice'})[0];
        let model = findObjs({ _type: "card", _deckid: deck.get('_id'), _id:obj.get('_cardid')})[0];
        if (model && model.get('name') == "?") {
			let dname = "" + Math.floor( Math.random() * 6 + 1 );
			let new_model = findObjs({ _type: "card", _deckid: deck.get('_id'), name: dname})[0];
			obj.set({currentSide:0,name:dname,imgsrc:new_model.get('avatar').replace('max','thumb').replace('med','thumb'),showname:false,showplayers_name:false});
        }
    }
}

function getPlotAreas() {

    var areas = [];
    if (findObjs({ name: 'A_delegate', _pageid: state.current_plot_page}).length > 0) {
        areas.push(findObjs({ name: 'A_delegate', _pageid: state.current_plot_page}));
    } else { sendChat("matchDice", "/w gm A_delegate 영역이 없습니다.",null,{noarchive:true}); return false; }
    if (findObjs({ name: 'A_observer', _pageid: state.current_plot_page}).length > 0) {
        areas.push(findObjs({ name: 'A_observer', _pageid: state.current_plot_page}));
    } else { sendChat("matchDice", "/w gm A_observer 영역이 없습니다.",null,{noarchive:true}); return false; }
    if (findObjs({ name: 'B_delegate', _pageid: state.current_plot_page}).length > 0) {
        areas.push(findObjs({ name: 'B_delegate', _pageid: state.current_plot_page}));
    } else { sendChat("matchDice", "/w gm B_delegate 영역이 없습니다.",null,{noarchive:true}); return false; }
    if (findObjs({ name: 'B_observer', _pageid: state.current_plot_page}).length > 0) {
        areas.push(findObjs({ name: 'B_observer', _pageid: state.current_plot_page}));
    } else { sendChat("matchDice", "/w gm B_observer 영역이 없습니다.",null,{noarchive:true}); return false; }

    return areas;
}
// /define: global function

/* (magicalogia_match_dice.js) 210505 코드 종료 */