/* https://github.com/kibkibe/roll20-api-scripts/tree/master/token_connector */
/* (token_connector.js) 220119 코드 시작 */

// define: option
const tc_setting = {
	// option: Bar가 표시될 기본 위치를 지정합니다. (선택: 'top','overlap_top’,‘overlap_bottom’,'below')
	bar_location: 'below',
	// option: Bar를 컴팩트한 스타일로 표시할지(true) 기본 스타일로 표시할지(false) 지정합니다.
	compact_bar: false,
	// option: Bar를 권한이 없는 다른 사용자에게도 표시할지 지정합니다.
	showplayers_bar: true
}
// /define: option

on('ready', function() {
	// on.ready
    on("add:attribute", function(obj) {
        tc_change_value(obj, null);
    });
	// /on.ready
});
    
on("change:attribute", function(obj, prev) {
	// on.change:attribute
    tc_change_value(obj, prev);
	// /on.change:attribute
});


on("change:graphic", function(obj, prev) {
	// on.change:graphic
	if (obj.get('gmnotes').length > 0 &&
	(obj.get('bar1_value') != prev.bar1_value || obj.get('bar1_max') != prev.bar1_max ||
	obj.get('bar2_value') != prev.bar2_value || obj.get('bar2_max') != prev.bar2_max ||
	obj.get('bar3_value') != prev.bar3_value || obj.get('bar3_max') != prev.bar3_max)) {
		try {
			const connections = JSON.parse(unescape(obj.get('gmnotes')));
			const keys = Object.keys(connections);
			for (let i = 0; i < keys.length; i++) {
				const key = keys[i];
				if (obj.get(key.replace('link','value')) != prev[key.replace('link','value')] || obj.get(key.replace('link','max')) != prev[key.replace('link','max')]) {
					const attr = getObj('attribute',connections[key]);
					if (attr) {
						attr.set('current',obj.get(key.replace('link','value')));
						attr.set('max',obj.get(key.replace('link','max'))?obj.get(key.replace('link','max')):0);
					} else {
						obj.set("status_red", true);
						obj.set("gmnotes","");
						sendChat('ERROR','/w GM token_connector.js / 값이 올바르지 않게 연결된 토큰이 있어 해당 토큰을 연동 초기화 후 마커(빨강)를 추가했습니다.',null,{noarchive:true});
					}
					break;
				}
			}
		} catch(err) {
			obj.set("status_red", true);
			sendChat('ERROR','/w GM token_connector.js / 값이 올바르지 않게 연결된 토큰이 있어 해당 토큰을 연동 초기화 후 마커(빨강)를 추가했습니다.',null,{noarchive:true});
		}
	}
	// /on.change:graphic
});

on("chat:message", function(msg){
    if (msg.type == "api"){
		// on.chat:message:api
    if (playerIsGM(msg.playerid) && msg.content.indexOf("!캐릭터") === 0) {
		try {
			if (!msg.selected || msg.selected.length == 0) {
                sendChat('ERROR','/w GM token_connector.js / 캐릭터와 연결할 토큰이 선택되지 않았습니다.',null,{noarchive:true});
				return;
			}
            let split = msg.content.split("'");
            let cha = findObjs({name:split.length==1 ? msg.who:split[1], type:'character'});
            if (cha.length < 1) {
				if (split.length < 3) {
					sendChat('ERROR','/w GM token_connector.js / 토큰과 연결할 캐릭터 이름이 올바르게 지정되지 않았습니다. (ex: !캐릭터 \'이름\')',null,{noarchive:true});
					return;
				} else {
					sendChat('ERROR','/w GM 이름이 ' + split[1] + '인 캐릭터가 저널에 없습니다.',null,{noarchive:true});
					return;
				}
            } else {
                cha = cha[0];
            }
			msg.selected.forEach(token_info => {
				const token = getObj('graphic',token_info._id);
				try {
					let JSONString = token.get('gmnotes');
					let object = JSONString.length == 0 ? {} : JSON.parse(unescape(JSONString));
					Object.assign(object, {'represents':cha.get('id')});
					token.set('gmnotes',JSON.stringify(object));
				} catch (err){
					sendChat('error','/w GM '+err,null,{noarchive:true});
				}
			});
		} catch (err){
            sendChat('error','/w GM '+err,null,{noarchive:true});
		}
	} else if (playerIsGM(msg.playerid) && msg.content.indexOf("!연결 ") === 0) {
        try {
			if (!msg.selected || msg.selected.length == 0) {
                sendChat('ERROR','/w GM token_connector.js / 값을 연결할 토큰이 선택되지 않았습니다.',null,{noarchive:true});
				return;
			}
            let split = msg.content.split(" --");
            if (split.length < 2) {
                sendChat('ERROR','/w GM token_connector.js / 토큰과 연결할 값이 올바르게 지정되지 않았습니다. (ex: !연결 --attr1 --attr2 --attr3)',null,{noarchive:true});
                return;
            } else if (split.length > 4) {
                sendChat('ERROR','/w GM token_connector.js / 토큰과 연결할 값이 **' + (split.length -1) +'**개 지정되었습니다. 토큰 하나당 최대 3개까지만 연결 가능합니다.',null,{noarchive:true});
                return;
			}
			let opt = {};
			if (tc_setting.bar_location == 'overlap_top' || tc_setting.bar_location == 'overlap_bottom' || tc_setting.bar_location == 'below') {
				opt.bar_location = tc_setting.bar_location;
			} else {
				opt.bar_location = null;
			}
			opt.compact_bar = tc_setting.compact_bar ? "compact" : null;
			opt.controlledby = tc_setting.showplayers_bar ? "all" : null;

			msg.selected.forEach(token_info => {
				const token = getObj('graphic',token_info._id);
				let bar_index = 0;
				let JSONString = token.get('gmnotes');
				let token_json = JSONString.length == 0 ? {} : JSON.parse(unescape(JSONString));
				const cha = token_json.represents;
				if (!cha || cha.length == 0) {
					token.set("status_red", true);
					sendChat('ERROR','/w GM token_connector.js / 캐릭터와 연결되지 않은 토큰이 포함되어 있습니다. 식별할 수 있도록 해당 토큰에 마커를 추가했습니다.',null,{noarchive:true});
				} else {
					for (let i = 1; i < split.length; i++) {
						const attr_name = split[i].replace('attr_','');
						let attrs;
						if (attr_name.indexOf('*id*') > -1) {
							attrs = filterObjs(function(obj) {
								if (obj.get("_type") == 'attribute' && obj.get("_characterid") == token_json.represents) {
									const obj_name = obj.get('name');
									const attr_split = attr_name.split('*id*');
									if (obj_name.indexOf(attr_split[0]) == 0 &&
									obj_name.indexOf(attr_split[1]) == obj_name.length - attr_split[1].length) {
										return true;
									} else return false;
								} else return false;
							});
						} else {
							attrs = findObjs({_type:'attribute', _characterid: token_json.represents, name: attr_name});
						}
						if (attrs.length == 0) {
							const cha = getObj('character',token_json.represents);
							if (!cha) {
								token.set("status_red", true);
								token.set("gmnotes","");
								sendChat('ERROR','/w GM token_connector.js / 존재하지 않는 캐릭터와 연결된 토큰이 있어 해당 토큰을 연동 초기화 후 마커(빨강)를 추가했습니다.',null,{noarchive:true});
							} else {
								sendChat('ERROR','/w GM token_connector.js / **' + cha.get('name') + '** 캐릭터에 **' + attr_name + '** 속성이 없습니다. 시트에서 값을 입력해주세요.',null,{noarchive:true});
							}
						}
						attrs.forEach(attr => {
							if (bar_index == 0) {
								Object.assign(token_json,{'bar1_link':attr.get('id')});
								Object.assign(opt,{'bar1_value':attr.get('current'),'bar1_max':attr.get('max')?attr.get('max'):0,
								'showplayers_bar1':tc_setting.showplayers_bar,'playersedit_bar1':tc_setting.showplayers_bar});
							} else if (bar_index == 1) {
								Object.assign(token_json,{'bar2_link':attr.get('id')});
								Object.assign(opt,{'bar2_value':attr.get('current'),'bar2_max':attr.get('max')?attr.get('max'):0,
								'showplayers_bar2':tc_setting.showplayers_bar,'playersedit_bar2':tc_setting.showplayers_bar});
							} else if (bar_index == 2) {
								Object.assign(token_json,{'bar3_link':attr.get('id')});
								Object.assign(opt,{'bar3_value':attr.get('current'),'bar3_max':attr.get('max')?attr.get('max'):0,
								'showplayers_bar3':tc_setting.showplayers_bar,'playersedit_bar3':tc_setting.showplayers_bar});
							}
							bar_index++;
						});
						Object.assign(opt,{'gmnotes':JSON.stringify(token_json)});
						token.set(opt);
					}
				}
			});
        } catch (err) {
            sendChat('error','/w GM '+err,null,{noarchive:true});
        }
    }
	// /on.chat:message:api
}
});


// define: global function
function tc_change_value(obj, prev) {
	const cha_id = obj.get('_characterid');
	const tokens = filterObjs(function(token){
		if (token.get('_type') == 'graphic' && token.get('gmnotes')) {
			let note = token.get('gmnotes');
			if (typeof note != 'string') {
				return false;
			}
			if (note.indexOf(cha_id) > -1 && note.indexOf(obj.get('_id')) > -1 && note.indexOf('"represents":"') > -1) {
				return true;
			}		
		}
		return false;
	});
	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		try {
			const connections = JSON.parse(unescape(token.get('gmnotes')));
			const keys = Object.keys(connections);
			for (let j = 0; j < keys.length; j++) {
				const key = keys[j];
				if (connections[key] == obj.get('id')) {
					token.set(key.replace('link','value'), obj.get('current'));
					if (obj.get('max') && obj.get('max').length > 0) {
						token.set(key.replace('link','max'), obj.get('max'));
					}
				}
			}
		} catch(err) {
			token.set("status_red", true);
			obj.set("gmnotes","");
			sendChat('ERROR','/w GM token_connector.js / 값이 올바르지 않게 연결된 토큰이 있어 해당 토큰을 연동 초기화 후 마커(빨강)를 추가했습니다.',null,{noarchive:true});
		}
	}
}
// /define: global function

/* (token_connector.js) 220119 코드 종료 */
