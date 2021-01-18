/* https://github.com/kibkibe/roll20-api-scripts/tree/master/narrator */
/* (narrator.js) 210118 코드 시작 */
const nt_linebreaker = 'Uk3jmApq-*QzfkMA';
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
			const split = state.narration[0].msg.split(nt_linebreaker);
			split.forEach(element => {
				sendChat(state.narration[0].as,element + (api_tag&&!element.includes(api_tag)?api_tag:""));
			});
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
	try {
		if (msg.content == "!,") { //일시정지/재시작
			if (state.is_narrating == 2) {
				state.is_narrating = 1;
			} else {
				state.is_narrating = 2;
				narrate();
			}
		} else if (msg.content == "!/") { //취소
		
				state.narration = [];
				state.is_narrating = 1;
			
		} else if (msg.content.indexOf("!... ") == 0) { //명령어를 변경하실 수 있습니다.
			var str = msg.content.replace("!... ","");
			var as_who;

			if (str.indexOf("/desc") == 0) {
				as_who = '';
			} else if (str.indexOf("/as") == 0 || str.indexOf("/emas") == 0) {
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
		} else if (msg.content.indexOf("!,,, ") == 0) {

			var str = msg.content.replace("!,,, ","");
			if (state.narration.length > 0) {
				state.narration[state.narration.length-1].msg += "<br>" + str;
			} else {
				sendChat('error','/w GM !,,, 명령어로 줄바꿈을 시도했으나 이전 줄이 없습니다. !...로 첫줄을 먼저 쓰세요.',null,{noarchive:true});
			}
		} else if (msg.content.indexOf("!. ") == 0) {
			var str = msg.content.replace("!. ","");
			if (state.narration.length > 0) {
				state.narration[state.narration.length-1].msg += nt_linebreaker + str;
			} else {
				sendChat('error','/w GM !. 명령어로 줄바꿈을 시도했으나 이전 줄이 없습니다. !...로 첫줄을 먼저 쓰세요.',null,{noarchive:true});
			}
		}
	} catch (err) {
		sendChat('error','/w GM '+err,null,{noarchive:true});
	}
}});
/* (narrator.js) 210118 코드 종료 */
