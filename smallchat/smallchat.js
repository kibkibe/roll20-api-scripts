/* https://github.com/kibkibe/roll20-api-scripts/tree/master/smallchat */
/* (smallchat.js) 210306 코드 시작 */

// define: option
const sc_setting = {
	// option: show_player_name을 true로 설정하시면 플레이어 As로, false로 설정하시면 선택되어 있는 As를 유지한 채 잡담을 합니다.
	show_player_name: true
};
// /define: option

on("chat:message", function(msg)
{
if (msg.type == "api"){
	// on.chat:message:api
    if (msg.content.indexOf("! ") === 0) {
        const style = "color:#aaaaaa";
        try {
            let chat_id = "";
            if (!sc_setting.show_player_name) {
                let character = findObjs({type:'character',name:msg.who});
                if (character.length > 0) {
                    chat_id = "character|" + character[0].get('_id');
                }
            }
            chat_id = chat_id ? chat_id : "player|"+msg.playerid;
            sendChat(chat_id,"<span style='" + style + "'>"+msg.content.substring(2, msg.content.length)+"</span>",null,{noarchive:false});
        } catch (err) {
			sendChat('error','/w GM '+err,null,{noarchive:true});
        }
    }
	// /on.chat:message:api
}
});
/* (smallchat.js) 210306 코드 종료 */