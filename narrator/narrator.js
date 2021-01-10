/* 설치법: https://github.com/kibkibe/roll20_api_scripts/wiki/%5B%EC%84%A4%EC%B9%98%EB%B2%95%5D-narrator.js */
/* (narrator.js) 201127 코드 시작 */
on('ready', function() {
    if (!state.narration) {
        state.narration = [];
    }
    if (!state.is_narrating) {
        state.is_narrating = 1; //0: 초기화 이전 1: 정지상태 2: 낭독중 3: 일시정지
    }
});

function narrate() {
	
	// (옵션) 대화를 표시하는 시간 간격을 조절합니다. 밀리초 단위로서 1000 = 1초입니다.
	let interval = 3000;

	try {
    	if (state.is_narrating == 2 && state.narration.length > 0) {
    		sendChat(state.narration[0].as,state.narration[0].msg);
    		state.narration.splice(0,1);
    		if (state.narration.length > 0) {
    			setTimeout(narrate, interval);
    		} else {
    			state.is_narrating = 1;
    		}
    	} else {
    		state.is_narrating = 1;
    	}
	} catch (err) {
		sendChat('error','/w GM '+err,null,{noarchive:true});
	}
}
on("chat:message", function(msg)
{
if (msg.type == "api"){
	if (msg.content == "!,") { //일시정지/재시작
		if (state.is_narrating == 2) {
			state.is_narrating = 1;
		} else {
			state.is_narrating = 2;
			narrate();
		}
	} else if (msg.content == "!/") { //취소
	
		try {
    	    state.narration = [];
    	    state.is_narrating = 1;
		} catch (err) {
			sendChat('error','/w GM '+err,null,{noarchive:true});
		}
	    
	} else if (msg.content.indexOf("!... ") === 0) { //명령어를 변경하실 수 있습니다.
		try {
			var str = msg.content.replace("!... ","");
			var as_who;

			if (str.indexOf("/desc") === 0) {
				as_who = '';
			} else if (str.indexOf("/as") === 0 || str.indexOf("/emas") === 0) {
				var arr = str.split('"');
				var cha = findObjs({_type: "character", name: arr[1]})[0];
				if (cha) {
					as_who = "character|" + cha.get('_id');
				} else {
					as_who = arr[1];
				}
				if (str.indexOf("/emas") === 0) {
					str = "/em " + str.substring('/emas '.length + arr[1].length + 3);
				} else {
					str = str.substring('/as '.length + arr[1].length + 3);
				}
			} else {
			    as_who = findObjs({_type: "character", name: msg.who.replace(' (GM)','')});
			    if (as_who.length > 0) {
			        as_who = "character|" + as_who[0].get('_id');
			    } else {
			        as_who = findObjs({_type: "player", _displayname: msg.who.replace(' (GM)','')});
    			    if (as_who.length > 0) {
    			        as_who = "player|" + as_who[0].get('_id');
    			    } else {
    			        as_who = msg.who;
    			    }
			    }
			}

			state.narration.push({as: as_who, msg: str});
			
			if (state.is_narrating == 1) {
			    state.is_narrating = 2;
			    setTimeout(narrate, 500);
			}

		} catch (err) {
			sendChat('error','/w GM '+err,null,{noarchive:true});
		}
    }
}});
/* (narrator.js) 201127 코드 종료 */