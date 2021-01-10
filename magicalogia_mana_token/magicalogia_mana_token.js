/* 설치법: https://github.com/kibkibe/roll20_api_scripts/wiki/%5B%EC%84%A4%EC%B9%98%EB%B2%95%5D-magicalogia_mana_token.js */
/* (magicalogia_mana_token.js) 201210 코드 시작 */
let charge_check = [
    {attr: "Magic_*id*_Charge", is_static_attr: false},
    {attr: "repeating_acitems_-*id*_Magic_Charge", is_static_attr: false}];
on('ready', function() {
    on("add:attribute", function(obj) {
        check_charge(obj, null);
    });
});
    
on("change:attribute", function(obj, prev) {
    check_charge(obj, prev);
});

function check_charge(obj,prev) {
    try {
        for (var i=0;i<charge_check.length;i++) {
            var check = false;
            var item = charge_check[i];
            let item_id = null;
            if (prev == null || obj.get('current') != prev.current) {
                if (item.attr == obj.get('name')) {
                    check = true;
                } else if (!item.is_static_attr) {
                    let split_attr = item.attr.split('*id*');
                    if (split_attr.length == 2 && obj.get('name').startsWith(split_attr[0]) && obj.get('name').endsWith(split_attr[1])) {
                        check = true;
                        item_id = obj.get('name').replace(split_attr[0],'').replace(split_attr[1],'');
                    }
                }
            }
            if (check) {
                var tokens = findObjs({_type: 'graphic', _subtype: 'token', layer: 'objects', _pageid: Campaign().get("playerpageid"),
                represents: prev._characterid, bar1_link: prev._id});
                if (tokens.length == 0) {
                    sendChat("error","/w gm ",null,{noarchive:true});
                    return;
                }
                for (var j=0;j<tokens.length;j++) {
                    let token = tokens[j];
                    if (token.get('gmnotes') != 'static' && token.get('bar1_link') == prev._id) {
                        if (parseInt(obj.get('current')) >= token.get('sides').split('|').length) {
                            sendChat("error","/w gm " + obj.get('current') + "개의 마소를 표시할 수 있는 아이콘이 없습니다.",null,{noarchive:true});
                            return;
                        } else {
                            token.set({imgsrc: unescape(token.get('sides').split('|')[parseInt(obj.get('current'))].replace('max','thumb').replace('med','thumb'))});
                        }
                        break;
                    }
                }
                break;
            }
        }
    } catch (err) {
        sendChat("error","/w gm " + err,null,{noarchive:true});
    }
}

on("chat:message", function(msg){
    if (msg.type == "api"){
    if (msg.content.indexOf("!장서토큰") === 0) {
        
        //사용할 마소 속성 리스트를 지정합니다.
        let area_list = ['별','짐승','힘','노래','꿈','어둠','전체'];
        //영역별로 속성을 나타내는 아이콘 하나만 사용하는지(true) 마소 개수에 따라 여러개 사용하는지(false)를 지정합니다.
        let use_single_icon = false;
        //장서의 아이콘이 한 아이콘으로 고정되는지(true) 마소 충전 상태에 따라 바뀌는지 (false)를 지정합니다.
        //(이 값은 use_single_icon이 false일 때만 유효합니다.)
        let use_static_icon = false;
        //마소 아이콘을 속성당 하나만 사용할 경우, 모든 속성의 아이콘을 모아놓은 Rollable table의 이름을 지정합니다.
        //(이 값은 user_single_icon이 true일 때만 유효합니다.)
        let collection_name = '마소';
        //생성된 장서 토큰에 이름을 표시할지를 지정합니다. (true:표시/false:숨김)
        let show_name = true;
        //생성된 장서 토큰에 충전상태를 나타내는 Bar를 표시할지를 지정합니다. (true:표시/false:숨김)
        let show_bar = false;
        //기본 아이콘으로 사용할 롤러블 테이블 이름을 지정합니다. (코스트가 없는 경우 등)
        let default_area = '전체';
        //페이지 격자의 가로 or 세로 크기입니다.
        let size = 70;
        //토큰을 생성할 페이지의 이름을 지정합니다. (공백으로 둘 경우 Players 마크가 꽂혀있는 페이지에 자동으로 생성합니다.)
        let page_name = "";
        
        try {
            
            var split = msg.content.split(' --');
            if (split.length < 2) {
                sendChat('ERROR','/w GM magicalogia_token_generator.js / 장서토큰을 생성할 캐릭터 이름이 지정되지 않았습니다.',null,{noarchive:true});
                return;
            }
            var cha = findObjs({name:split[1], type:'character'});
            if (cha.length < 1) {
                sendChat('ERROR','/w GM 이름이 ' + split[1] + '인 캐릭터가 저널에 없습니다.',null,{noarchive:true});
                return;
            } else {
                cha = cha[0];
            }
            var page;
            if (page_name.length == 0) {
                page = getObj('page', Campaign().get("playerpageid"));
            } else {
                page = findObjs({name:page_name, type:'page'}, {caseInsensitive: true});
                if (page.length > 0) {
                    page = page[0];
                } else {
                    sendChat('ERROR','/w GM magicalogia_token_generator.js / 이름이 \'' + page_name + '\' 인 페이지가 없습니다.',null,{noarchive:true});
                    return;
                }
            }
                
            var id_list = {};
            var attrs = findObjs({_type: "attribute", _characterid: cha.id});
            
            for (var i=0;i<attrs.length;i++) {
                var item = attrs[i].get('name');
                var id;
                
                if (item.indexOf('Magic_') === 0) {
                    id = item.split('_')[1];
                } else if (item.includes('repeating_') && item.includes('_Magic')) {
                    id = item.split('_')[2];
                }
                if (id) {
                    if (!id_list[id]) {
                        id_list[id] = {};
                    }
                    if (item.includes('_Name')) {
                        id_list[id].name = attrs[i].get('current');
                        id_list[id].orig_name = item;
                    } else if (item.includes('_Cost')) {
                        for (var j=0;j<area_list.length;j++) {
                            var cost_value = attrs[i].get('current');
                            if (cost_value.includes(area_list[j])) {
                                id_list[id].cost = area_list[j];
                                id_list[id].orig_cost = cost_value;
                            }
                        }
                        if (!id_list[id].cost) {
                            id_list[id].cost = default_area;
                        }
                    } else if (item.includes('_Charge')) {
                        id_list[id].charge_id = attrs[i].id;
                    }
                }
            }
            
            var keys = Object.keys(id_list);
            split.splice(0,2);
            
            for (var i=0;i<keys.length;i++) {
                
                var obj = id_list[keys[i]];
                var init_idx = -1;
                
                if (obj.name) {
                
                    if (!obj.charge_id) {
                        var charge_attr = createObj('attribute', {name:obj.orig_name.replace('_Name','_Charge'),current:0, characterid: cha.id});
                        obj.charge_id = charge_attr.id;
                    }

                    let current_charge = getObj('attribute',obj.charge_id);

                    var rt_item = null;
                    var sides = "";

                    if (use_single_icon) {
                        init_idx = 0;
                        var rt = findObjs({name:collection_name, type:'rollabletable'});
                        if (rt.length < 1) {
                            sendChat('ERROR','/w GM magicalogia_token_generator.js / 이름이 \'' + collection_name + '\' 인 Rollable Table이 없습니다.',null,{noarchive:true});
                            return;
                        }
                        rt_item = findObjs({type:'tableitem', _rollabletableid: rt[0].id, name: obj.cost});
                        if (rt_item.length < 1) {
                            rt_item = findObjs({type:'tableitem', _rollabletableid: rt[0].id, name: default_area});
                            if (rt_item.length < 1) {
                                if (obj.cost) {
                                    sendChat('ERROR','/w GM magicalogia_token_generator.js / 이름이 \'' + obj.cost + '\'이거나 \'' + default_area + '\' 인 item이 '+ collection_name +' Rollable table 안에 없습니다.',null,{noarchive:true});
                                } else {
                                    sendChat('ERROR','/w GM magicalogia_token_generator.js / 기본으로 사용할 \'' + default_area + '\' 속성의 item이 \''+ collection_name +'\' Rollable table 안에 없습니다.',null,{noarchive:true});
                                }
                                return;
                            }
                        }

                    } else {
                    
                        var rt = findObjs({name:obj.cost, type:'rollabletable'});
                        if (rt.length < 1) {
                            rt = findObjs({name:default_area, type:'rollabletable'});
                            if (rt.length < 1) {
                                if (obj.cost) {
                                    sendChat('ERROR','/w GM magicalogia_token_generator.js / 이름이 \'' + obj.cost + '\'이거나 \'' + default_area + '\'인 Rollable table이 없습니다.',null,{noarchive:true});
                                } else {
                                    sendChat('ERROR','/w GM magicalogia_token_generator.js / 기본으로 사용할 \'' + default_area + '\' 속성의 Rollable table이 없습니다.',null,{noarchive:true});
                                }
                                return;
                            }
                        }
                        rt_item = findObjs({type:'tableitem', _rollabletableid: rt[0].id});
                        if (rt_item.length == 0) {
                            sendChat('ERROR','/w GM magicalogia_token_generator.js / \'' + rt[0].get('name') + '\' 영역에 사용할 수 있는 아이콘이 없습니다.',null,{noarchive:true});
                            return;
                        }
                        for (var j=0;j<rt_item.length;j++) {
                            sides += escape(rt_item[j].get('avatar'));
                            if (j<rt_item.length-1) {
                                sides += "|";
                            }
                            if (use_static_icon && init_idx == -1 && obj.orig_cost && obj.orig_cost.toLowerCase().includes(rt_item[j].get('name').toLowerCase())) {
                                init_idx = j;
                            } else if (!use_static_icon && init_idx == -1 && (current_charge.get('current') + "") == rt_item[j].get('name')) {
                                init_idx = j;
                            }
                        }

                        if (init_idx == -1) {
                            sendChat('ERROR','/w GM magicalogia_token_generator.js / \'' + rt[0].get('name') + '\' 영역 중 ' + current_charge.get('current') + '에 대응되는 아이콘이 없습니다. 0번째 아이콘으로 대체합니다.',null,{noarchive:true});
                            init_idx = 0;
                        }
                    }
                    
                    var setting = {
                        _pageid: page.id,
                        left: Math.floor(page.get('width')/2)*size,
                        top: Math.floor(page.get('height')/2)*size,
                        represents: cha.id,
                        width: size,
                        height: size,
                        imgsrc: rt_item[init_idx].get('avatar').replace('max','thumb').replace('med','thumb'),
                        layer: 'objects',
                        sides:sides,
                        currentSide:0,
                        name: obj.name,
                        bar1_link: obj.charge_id,
                        playersedit_name: false,
                        showname: false,
                        bar1_value: current_charge.get('current'),
                        showplayers_name: false,
                        showplayers_bar2: false,
                        showplayers_bar3: false,
                        playersedit_bar1: false,
                        playersedit_bar2: false,
                        playersedit_bar3: false,
                        playersedit_aura1: false,
                        playersedit_aura2: false,
                        gmnotes: use_static_icon ? "static" : ""
                    };
                    if (show_name) {
                        Object.assign(setting, {showname: true, showplayers_name: true});
                    }
                    
                    var token = createObj('graphic', setting);
                    
                    if (show_bar) {
                        current_charge.set('max',getAttrByName(cha.id, "bas"));
                        token.set({bar1_max:getAttrByName(cha.id, "bas"), showplayers_bar1: true});
                    } else {
                        setTimeout(function(){
                            current_charge.set('max',"");
                            token.set({bar1_max:"", showplayers_bar1: false});
                        },100);
                    }
                }
            }
            
        } catch (err) {
            sendChat('error','/w GM '+err,null,{noarchive:true});
        }
    }
}
});
/* (magicalogia_mana_token.js) 201210 코드 종료 */
