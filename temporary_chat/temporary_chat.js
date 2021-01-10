/* 설치법: https://github.com/kibkibe/roll20_api_scripts/wiki/%5B%EC%84%A4%EC%B9%98%EB%B2%95%5D-temporary_chat.js */
/* (temporary_chat.js) 201101 코드 시작 */
on("chat:message", function(msg){
    if (msg.type == "api"){
        if (msg.content.indexOf("!? ") === 0) {
            //show_player_name을 true로 설정하시면 플레이어 As로, false로 설정하시면 선택되어 있는 As를 유지한 채 임시채팅을 합니다.
            let show_player_name = true;
            //임시메시지에 적용할 스타일을 지정합니다.
            let style = "font-size:0.9em;";
            try {
                sendChat((show_player_name? "player|"+msg.playerid : msg.who),"<span style='" + style + "'>"+msg.content.substring(3, msg.content.length)+"</span>",null,{noarchive:true});
            } catch (error) {
                sendChat('error','/w GM '+err,null,{noarchive:true});
            }
        }
    }
});
/* (temporary_chat.js) 201101 코드 종료 */