/* https://github.com/kibkibe/roll20-api-scripts/tree/master/smallchat */
/* (smallchat.js) 210129 코드 시작 */
on("chat:message", function(msg)
{
if (msg.type == "api"){
    if (msg.content.indexOf("! ") === 0) {
        //show_player_name을 true로 설정하시면 플레이어 As로, false로 설정하시면 선택되어 있는 As를 유지한 채 잡담을 합니다.
        let show_player_name = true;
        let style = "color:#aaaaaa";
        try {
            let chat_id = "";
            if (!show_player_name) {
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
}
});
/* (smallchat.js) 210129 코드 종료 */