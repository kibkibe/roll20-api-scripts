/* https://github.com/kibkibe/roll20-api-scripts/tree/master/utilities */
/* (temporary_chat.js) 210118 코드 시작 */
on("chat:message", function(msg){
    if (msg.type == "api"){
        if (msg.content.indexOf("!? ") === 0) {
            //show_player_name을 true로 설정하시면 플레이어 As로, false로 설정하시면 선택되어 있는 As를 유지한 채 임시채팅을 합니다.
            let show_player_name = true;
            //임시메시지에 적용할 스타일을 지정합니다.
            let style = "font-size:0.9em;";
            try {
                sendChat((show_player_name? "player|"+msg.playerid : msg.who),"<span style='" + style + "'>"+msg.content.substring(3, msg.content.length)+"</span>",null,{noarchive:true});
            } catch (err) {
                sendChat('error','/w GM '+err,null,{noarchive:true});
            }
        }
    }
});
/* (temporary_chat.js) 210118 코드 종료 */