/* https://github.com/kibkibe/roll20-api-scripts/tree/master/whisper_tap */
/* (whisper_share.js) 211128 코드 시작 */

on("chat:message", function(msg){
    if (msg.type == "whisper"){
		// on.chat:message:whisper
		{
			const from = getObj('player',msg.playerid);
			const to = getObj('player',msg.target);
			if (from && to && !playerIsGM(msg.playerid) && !playerIsGM(msg.target) && msg.target != 'gm') {
				sendChat(msg.who,'/w gm -> **(To ' + msg.target_name + ') **' + msg.content);
			}
		}		
		// /on.chat:message:whisper
	}
});
/* (whisper_share.js) 211128 코드 종료 */