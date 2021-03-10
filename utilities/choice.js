/* https://github.com/kibkibe/roll20-api-scripts/tree/master/utilities */
/* (choice.js) 210306 코드 시작 */
on("chat:message", function(msg)
{
	// on.chat:message:general
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
	// /on.chat:message:general
});
/* (choice.js) 210306 코드 종료 */
