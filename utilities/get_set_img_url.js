/* https://github.com/kibkibe/roll20-api-scripts/tree/master/utilities */
/* (get_set_img_url.js) 210118 코드 시작 */
on("chat:message", function(msg)
{
if (msg.type == "api"){
	try {
		if (msg.content.indexOf("!add") === 0) {
			var tok = getObj("graphic", msg.selected[0]._id);
			sendChat(msg.who,"/w gm "+tok.get('imgsrc'));
		} else if (msg.content.indexOf("!replace ") === 0) {
			var tok = getObj("graphic", msg.selected[0]._id);
			tok.set('imgsrc',msg.content.substring(9).replace("max","thumb").replace("med","thumb"));
		} else if (msg.content.indexOf("!log") === 0) {
			for (var i=0;i<msg.selected.length;i++) {
			    var tok = getObj("graphic", msg.selected[i]._id);
		        log(tok);
			}
		} else if (msg.content.indexOf("!batch") === 0 && msg.selected.length > 0) {
			let highest = msg.selected[0];
			for (var i=0;i<msg.selected.length;i++) {
				var tok = getObj("graphic", msg.selected[i]._id);
				if (highest.get('top') > tok.get('top')) {
					highest = tok;
				}
			}
			for (var i=0;i<msg.selected.length;i++) {
				var tok = getObj("graphic", msg.selected[i]._id);
				tok.set("imgsrc", highest.get('imgsrc').replace("max","thumb").replace("med","thumb"));
			}
		}
	} catch(err){
		sendChat("error","/w gm "+err,null,{noarchive:true});
	}
}
});
/* (get_set_img_url.js) 210118 코드 종료 */
