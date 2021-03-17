/* https://github.com/kibkibe/roll20-api-scripts/tree/master/utilities */
/* (hide_handouts.js) 210317 코드 시작 */

on("chat:message", function(msg) {
	if (msg.type == "api"){
		// on.chat:message:api
		if (msg.content.indexOf("!hide_handouts") == 0) {
			const handouts = findObjs({type:"handout"});
			for (let index = 0; index < handouts.length; index++) {
				const handout = handouts[index];
				handout.set({inplayerjournals:"",controlledby:""});
			}
		}
		// /on.chat:message:api
	}
});