/* https://github.com/kibkibe/roll20-api-scripts/tree/master/utilities */
/* (simple_desc.js) 210414 코드 시작 */
on("chat:message", function(msg)
{
if (msg.type == "api"){
	// on.chat:message:api
    if (msg.content.indexOf("!d ") == 0 || msg.content.indexOf("!ㅇ ") == 0 || msg.content.indexOf("!ㄷ ") == 0) {
		try {
			sendChat("","/desc " + msg.content.substring(3,msg.content.length),null,{noarchive:false});
		} catch(err){
			sendChat("error","/w gm "+err,null,{noarchive:true});
		}
    }
	// /on.chat:message:api
}});
/* (simple_desc.js) 210414 코드 종료 */
