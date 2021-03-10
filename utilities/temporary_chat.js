/* https://github.com/kibkibe/roll20-api-scripts/tree/master/utilities */
/* (temporary_chat.js) 210306 코드 시작 */

// define: option
const tc_setting = {
	// option: true로 설정하시면 플레이어 As로, false로 설정하시면 선택되어 있는 As를 유지한 채 임시채팅을 합니다.
	show_player_name: true
};
// /define: option

on("chat:message", function(msg){
    if (msg.type == "api"){
		// on.chat:message:api
        if (msg.content.indexOf("!? ") === 0) {
            const style = "font-size:0.9em;";
            try {
                let chat_id = "";
                if (!tc_setting.show_player_name) {
                    let character = findObjs({type:'character',name:msg.who});
                    if (character.length > 0) {
                        character = character[0];
                        if (character.get('name').length == 0) {
                            chat_id = '';
                            sendChat("system","/w gm 이름의 길이가 0글자인 캐릭터를 통해 API로 채팅할 경우 이름이 올바르게 출력되지 않아 익명의 공백이름으로 표시되었습니다. \
                            아바타를 사용하면서 캐릭터의 이름을 보이지 않기를 원하실 경우 이름을 공백으로 두는 대신 **공백문자**(스페이스바 등)를 1글자 넣어주세요.",null,{noarchive:true});
                        } else {
                            chat_id = "character|" + character.get('_id');
                        }
                    } else {
                        chat_id = msg.who;
                    }
                }
                chat_id = chat_id ? chat_id : "player|"+msg.playerid;
                sendChat(chat_id,"<span style='" + style + "'>"+msg.content.substring(3, msg.content.length)+"</span>",null,{noarchive:true});
            } catch (err) {
                sendChat('error','/w GM '+err,null,{noarchive:true});
            }
        }
		// /on.chat:message:api
    }
});
/* (temporary_chat.js) 210306 코드 종료 */