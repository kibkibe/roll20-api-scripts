/* https://github.com/kibkibe/roll20-api-scripts/tree/master/attribute_tracker */
/* (attribute_tracker.js) 210719 코드 시작 */

// define: option
const at_setting = {
	// option: 변경을 감지할 속성을 목록 형태로 지정합니다.
	// 룰별 check list코드 공유페이지 https://docs.google.com/spreadsheets/d/1_uTqPs6FQJfjzDotRWqtJn8U6cVw_lVycDRal8vxZb8/edit#gid=609977791
	check_list:
	/* 체크리스트 시작 */
	[{attr: "Magic_*id*_Charge", name: "Magic_*id*_Name"},
		{attr: "repeating_acitems_-*id*_Magic_Charge", name: "repeating_acitems_-*id*_Magic_Name"},
		{attr: "Magic_*id*_Cost", name: "Magic_*id*_Name"},
		{attr: "repeating_acitems_-*id*_Magic_Cost", name: "repeating_acitems_-*id*_Magic_Name"},
		{attr: "relation_fate_*id*", name: "relation_name_*id*"},
		{attr: "atk", name: "공격력"},
		{attr: "def", name: "방어력"},
		{attr: "bas", name: "근원력"},
		{attr: "mp", name: "마력"},
		{attr: "temp_mp", name: "일시적 마력"},
		{attr: "mp_max", name: "최대마력"}]
	/* 체크리스트 끝 */
	,
	// option: 필수적으로 변화를 체크할 캐릭터의 이름을 기입합니다.
	// 이 값은 ignore_list보다 우선됩니다. (복수입력시 콤마(,)로 구분)
	prior_list: "",
	// option: 로그 표시에서 제외할 캐릭터의 이름을 기입합니다. (복수입력시 콤마(,)로 구분)
	// "GM"을 넣으면 GM에게만 조작권한이 있는 모든 캐릭터를 일괄적으로 제외합니다.
	ignore_list: "GM",
	// option: !at 명령어를 이용한 숨김/표시 모드를 사용하지 않은 기본상태에서 스테이터스 변경 내역을 GM에게 귓말로만 보낼지(true) 모두에게 표시할지(false) 설정합니다.
	use_secret_mode: false
}
// /define: option
    
on('ready', function() {
	// on.ready
	state.show_tracking = !at_setting.use_secret_mode;
	show_current_status();
    state.new_character = [];
    on("add:character",function(obj) {
        state.new_character.push({id:obj._id, time: Date.now()});
    });
    on("add:attribute", function(obj) {
        const now = Date.now();
        const interval = 3000;
        let check = true;
        for (let index = 0; index < state.new_character.length; index++) {
            const element = state.new_character[index];
            if (obj._id == element.id) {
                if (now - element.time > interval) {
                    state.new_character.splice(index,1);
                } else {
                    check = false;
                }
                break;
            }
        }
        if (check) {
            check_attribute(obj, null);
        }
    });
	// /on.ready
});
    
on("change:attribute", function(obj, prev) {
	// on.change:attribute
    check_attribute(obj, prev);
	// /on.change:attribute
});

on("chat:message", function(msg)
{
if (msg.type == "api" ){
	// on.chat:message:api
    if (msg.content.indexOf("!at") === 0 && (msg.playerid == 'API' || playerIsGM(msg.playerid))) {
		if (msg.content == "!at") {
			sendChat("attribute_tracker.js","/w gm [ 명령어 ]<br>- **!at show**: 로그 표시하기 / **!at hide**: 로그 숨기기",null,{noarchive:true});
		} else if (msg.content.toLowerCase().includes('hide')) {
            state.show_tracking = false;
        } else if (msg.content.toLowerCase().includes('show')) {
            state.show_tracking = true;
        }
		show_current_status();
	}
	// /on.chat:message:api
}
});

// define: global function
function show_current_status() {

	log((at_setting.use_secret_mode?"true":"false") + "/" + (state.show_tracking?"true":"false"));
	sendChat("attribute_tracker.js","/w gm <br>- 코드상의 옵션: **" + (at_setting.use_secret_mode ? "숨김":"표시")
	+ (at_setting.use_secret_mode != state.show_tracking ? "" : "** / 명령어로 지정된 모드: **" + (state.show_tracking ? "표시" : "숨김"))
	+ "**<br>- 현재 스테이터스 변동내역이 " + (state.show_tracking ? "모든 사용자에게 공개되고 있습니다." : "GM에게만 귓속말로 전달되고 있습니다."),null,{noarchive:true});
}

function check_attribute(obj,prev) {
    try {
        var check_pl = false;
        let cha = getObj('character',obj.get('_characterid'));
		const prior_list = at_setting.prior_list.split(/\s*,\s*/g);
		const ignore_list = at_setting.ignore_list.split(/\s*,\s*/g);
        if (prior_list.indexOf(cha.get('name')) > -1 || at_setting.ignore_list == 0) {
            check_pl = true;
        } else if (ignore_list.indexOf(cha.get('name')) > -1) {
            check_pl = false;
        } else if (ignore_list.indexOf('GM') > -1) {
            let controller = cha.get('controlledby').split(",");
            for (var i=0;i<controller.length;i++) {
                if (controller[i].length > 0 && !playerIsGM(controller[i])) {
                    check_pl = true;
                    break;
                }
            }
        }
        
        if (check_pl) {
            for (var i=0;i<at_setting.check_list.length;i++) {
                var check = false;
                var item = at_setting.check_list[i];
                let item_id = null;
                let attr_name = item.attr.replace('attr_');
                let check_max = attr_name.includes('_max');
                if (prev == null || check_max && obj.get('current') == prev.current || !check_max && obj.get('current') != prev.current) {
                    if (attr_name.replace('_max','') == obj.get('name')) {
                        check = true;
                    } else if (attr_name.indexOf('*id*') > -1) {
                        let split_attr = attr_name.split('*id*');
                        if (split_attr.length == 2 && obj.get('name').startsWith(split_attr[0]) && obj.get('name').endsWith(split_attr[1])) {
                            check = true;
                            item_id = obj.get('name').replace(split_attr[0],'').replace(split_attr[1],'');
                        }
                    }
                }
                if (check) {
                    var name = item.name;
                    if (name.indexOf('*id*') > -1) {
						name = item.name.replace('*id*',item_id);
                        var search_name = findObjs({type: "attribute", name: name, characterid: obj.get('_characterid')});
                        if (search_name.length > 0) {
                            name = search_name[0].get('current');
                        } else {
                            sendChat("error","/w gm 이름이 " + name + "인 값이 캐릭터시트에 없습니다.",null,{noarchive:true}); return;
                        }
                    }
                    sendChat("character|"+obj.get('_characterid'),
                    (state.show_tracking ? "":"/w GM ") +
                        "**" + name + "** / <span style='color:#aaaaaa'>" + (prev == null?"":(check_max? prev.max:prev.current)) + "</span><span style='color:#777777'> → </span><b>" +
                        (check_max ? obj.get('max'):obj.get('current'))+"</b>",null,{noarchive:false});
                    break;
                }
            }
        }
    } catch (err) {
        sendChat("error","/w gm " + err,null,{noarchive:true});
    }
}
// /define: global function
/* (attribute_tracker.js) 210719 코드 종료 */