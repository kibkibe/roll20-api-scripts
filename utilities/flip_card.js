/* https://github.com/kibkibe/roll20-api-scripts/tree/master/utilities */
/* (flip_card.js) 210118 코드 시작 */
on("chat:message", function(msg)
{
if (msg.type == "api"){
    if (msg.content.indexOf("!flip") === 0 && msg.selected) {
		try {
			for (var i=0;i<msg.selected.length;i++) {
				var obj = getObj("graphic", msg.selected[i]._id);
				var side = obj.get('currentSide')===0?1:0;
				var img = obj.get('sides').split('|')[side].replace('%3A',':').replace('%3F','?').replace('max','thumb').replace('med','thumb');
				obj.set({currentSide:side,imgsrc:img});
			}
		} catch(err){
			sendchat("error","/w gm "+err,null,{noarchive:true});
		}
    }
}});
/* (flip_card.js) 210118 코드 종료 */
