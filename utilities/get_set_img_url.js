/* https://github.com/kibkibe/roll20-api-scripts/tree/master/get_set_img_url.js */
/* (get_set_img_url.js) 210306 코드 시작 */

// define: option
const gi_setting = {
	// option: 강조표시에 사용할 색상을 설정합니다.
	aura_color: "#FFFF99"
}
// /define: option

on("chat:message", function(msg)
{
if (msg.type == "api"){
	// on.chat:message:api
	if (msg.content.indexOf("!add") === 0) {
		let tok = getObj("graphic", msg.selected[0]._id);
		sendChat(msg.who,"/w gm "+tok.get('imgsrc'));
	} else if (msg.content.indexOf("!replace ") === 0) {
		let tok = getObj("graphic", msg.selected[0]._id);
		tok.set('imgsrc',msg.content.substring(9).replace("max","thumb").replace("med","thumb"));
	} else if (msg.content.indexOf("!log") === 0) {
		for (let i=0;i<msg.selected.length;i++) {
			let tok = getObj("graphic", msg.selected[i]._id);
			log(tok);
		}
	} else if (msg.content.indexOf("!batch") === 0 && msg.selected.length > 0) {
		let highest = getObj("graphic", msg.selected[0]._id);
		for (let i=0;i<msg.selected.length;i++) {
			let tok = getObj("graphic", msg.selected[i]._id);
			if (highest.get('top') > tok.get('top')) {
				highest = tok;
			}
		}
		for (let i=0;i<msg.selected.length;i++) {
			let tok = getObj("graphic", msg.selected[i]._id);
			tok.set("imgsrc", highest.get('imgsrc').replace("max","thumb").replace("med","thumb"));
		}
	} else if (msg.content.indexOf("!highlight ") == 0) {
		let tokens = findObjs({type:"graphic", name:msg.content.replace('!highlight ','')});
		tokens.forEach(token => {
			if (isNaN(parseInt(token.get('aura1_radius')))) {
				token.set({aura1_radius:"1",aura1_color:gi_setting.aura_color,aura1_square:true});
			} else {
				token.set({aura1_radius:"",aura1_color:"",aura1_square:false});
			}
		});
	}
	// /on.chat:message:api
}
});
/* (get_set_img_url.js) 210306 코드 종료 */