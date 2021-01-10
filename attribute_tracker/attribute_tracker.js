/* 설치법: https://github.com/kibkibe/roll20_api_scripts/wiki/%5B%EC%84%A4%EC%B9%98%EB%B2%95%5D-attribute_tracker.js */
/* (attribute_tracker.js) 201212 코드 시작 */
// !! 아래의 예시 check_list 중 사용하실 1개만 남기고 삭제하시거나 사용할 룰에 맞춰 새 체크리스트를 생성하세요.
// CoC 체크리스트
let check_list = [
    {attr: "hp", name: "체력", is_static_name: true, is_static_attr: true},
    {attr: "mp", name: "마력", is_static_name: true, is_static_attr: true},
    {attr: "san", name: "이성", is_static_name: true, is_static_attr: true},
    {attr: "luck", name: "행운", is_static_name: true, is_static_attr: true},
    {attr: "str", name: "근력", is_static_name: true, is_static_attr: true},
    {attr: "dex", name: "민첩", is_static_name: true, is_static_attr: true},
    {attr: "pow", name: "정신", is_static_name: true, is_static_attr: true},
    {attr: "con", name: "건강", is_static_name: true, is_static_attr: true},
    {attr: "app", name: "외모", is_static_name: true, is_static_attr: true},
    {attr: "edu", name: "교육", is_static_name: true, is_static_attr: true},
    {attr: "siz", name: "크기", is_static_name: true, is_static_attr: true},
    {attr: "int", name: "지능", is_static_name: true, is_static_attr: true},
    {attr: "cthulhu_mythos", name: "크툴루 신화", is_static_name: true, is_static_attr: true}];

// 인세인 체크리스트
let check_list = [
    {attr: "hp", name: "생명력", is_static_name: true, is_static_attr: true},
    {attr: "san", name: "이성치", is_static_name: true, is_static_attr: true},
    {attr: "ins_item1", name: "진통제", is_static_name: true, is_static_attr: true},
    {attr: "ins_item2", name: "무기", is_static_name: true, is_static_attr: true},
    {attr: "ins_item3", name: "부적", is_static_name: true, is_static_attr: true}];

// 마기카로기아 체크리스트
let check_list = [
    {attr: "Magic_*id*_Charge", name: "Magic_*id*_Name", is_static_name: false, is_static_attr: false},
    {attr: "repeating_acitems_-*id*_Magic_Charge", name: "repeating_acitems_-*id*_Magic_Name", is_static_name: false, is_static_attr: false},
    {attr: "Magic_*id*_Cost", name: "Magic_*id*_Name", is_static_name: false, is_static_attr: false},
    {attr: "repeating_acitems_-*id*_Magic_Cost", name: "repeating_acitems_-*id*_Magic_Name", is_static_name: false, is_static_attr: false},
    {attr: "relation_fate_*id*", name: "relation_name_*id*", is_static_name: false, is_static_attr: false},
    {attr: "atk", name: "공격력", is_static_name: true, is_static_attr: true},
    {attr: "def", name: "방어력", is_static_name: true, is_static_attr: true},
    {attr: "bas", name: "근원력", is_static_name: true, is_static_attr: true},
    {attr: "mp", name: "마력", is_static_name: true, is_static_attr: true},
    {attr: "temp_mp", name: "일시적 마력", is_static_name: true, is_static_attr: true},
    {attr: "mp_max", name: "최대마력", is_static_name: true, is_static_attr: true}];

// 목록 작성 예시 (대괄호[ ]안에서 따옴표' '로 이름을 감싸서 반점,으로 분리해 기입하세요.)
// let prior_list = ['이름A','캐릭터 이름','character name'];

// 필수적으로 변화를 체크할 캐릭터의 이름을 기입합니다.
// ignore_list에 포함되는 조건을 갖고 있지만 로그에 표시할 필요가 있는 캐릭터가 해당됩니다. (예: GMPC)
let prior_list = [];

// 로그 표시에서 제외할 캐릭터의 이름을 기입합니다.
// 'GM'을 넣으면 GM에게만 조작권한이 있는 모든 캐릭터를 일괄적으로 제외합니다.
let ignore_list = ["GM"];
    
on('ready', function() {
    on("add:attribute", function(obj) {
        check_attribute(obj, null);
    });
    if (!state.show_tracking) {
        state.show_tracking = true;
    }
});
    
on("change:attribute", function(obj, prev) {
    check_attribute(obj, prev);
});

on("chat:message", function(msg)
{
if (msg.type == "api"){
    if (msg.content.indexOf("!at ") === 0) {
        if (msg.content.toLowerCase().includes('hide')) {
            state.show_tracking = true;
        } else if (msg.content.toLowerCase().includes('show')) {
            state.show_tracking = false;
        }
	}
}
});

function check_attribute(obj,prev) {
    try {
        var check_pl = false;
        let cha = getObj('character',obj.get('_characterid'));
        if (prior_list.indexOf(cha.get('name')) > -1 || ignore_list.length == 0) {
            check_pl = true;
        } else if (ignore_list.indexOf(cha.get('name')) > -1) {
            check_pl = false;
        } else if (ignore_list.indexOf('GM') > -1) {
            let controller = cha.get('controlledby').split(",");
            for (var i=0;i<controller.length;i++) {
                if (!playerIsGM(controller[i])) {
                    check_pl = true;
                    break;
                }
            }
        }
        
        if (check_pl) {
            for (var i=0;i<check_list.length;i++) {
                var check = false;
                var item = check_list[i];
                let item_id = null;
                let check_max = item.attr.includes('_max');
                if (prev == null || check_max && obj.get('current') == prev.current || !check_max && obj.get('current') != prev.current) {
                    if (item.attr.replace('_max','') == obj.get('name')) {
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
                    var name = item.name;
                    if (!item.is_static_name) {
                        if (!item.is_static_attr) {
                            name = item.name.replace('*id*',item_id);
                        }
                        var search_name = findObjs({type: "attribute", name: name, characterid: obj.get('_characterid')});
                        if (search_name.length > 0) {
                            name = search_name[0].get('current');
                        } else {
                            sendChat("error","/w gm 이름이 " + name + "인 값이 캐릭터시트에 없습니다.",null,{noarchive:true}); return;
                        }
                    }
                    sendChat("character|"+obj.get('_characterid'),
                    (state.show_tracking ? "" : "/w GM ") +
                        "**" + name + "** / " + (prev == null?"":(check_max? prev.max:prev.current)) + " → " +
                        (check_max ? obj.get('max'):obj.get('current')),null,{noarchive:!state.show_tracking});
                    break;
                }
            }
        }
    } catch (err) {
        sendChat("error","/w gm " + err,null,{noarchive:true});
    }
}
/* (attribute_tracker.js) 코드 종료 */