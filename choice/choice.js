/* 설치법 https://github.com/kibkibe/roll20_api_scripts/wiki/%5B%EC%84%A4%EC%B9%98%EB%B2%95%5D-choice.js */
/* (choice.js) 201226 코드 시작 */
on("chat:message", function(msg)
{
if (msg.content.substring(0,7).toLowerCase() == "choice[") {
    try {
        var split = msg.content.substring(7,msg.content.length).replace(']','').split(',');
        var rand = split[Math.floor(Math.random() * split.length)];
        if (rand.substring(0) == ' ') { rand=rand.substring(1,rand.length);}
        if (rand.substring(rand.length-1,rand.length) == ' ') { rand=rand.substring(0,rand.length-1); }
        sendChat("CHOICE","-> "+rand);
    } catch(err){
        sendChat("error","/w gm "+err,null,{noarchive:true});
    }
}
});
/* (choice.js) 201226 코드 종료 */
