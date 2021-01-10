/* 설치법: https://github.com/kibkibe/roll20_api_scripts/wiki/%5B%EC%84%A4%EC%B9%98%EB%B2%95%5D-flip_card.js */
/* (flip_card.js) 201101 코드 시작 */
on("chat:message", function(msg)
{
if (msg.type == "api"){
    if (msg.content.indexOf("!flip") === 0 && msg.selected) {
		try {
			for (var i=0;i<msg.selected.length;i++) {
				var obj = getObj("graphic", msg.selected[i]._id);
				var side = obj.get('currentSide')===0?1:0;
				var img = obj.get('sides').split('|')[side].replace('%3A',':').replace('%3F','?').replace('max','thumb');
				obj.set({currentSide:side,imgsrc:img});
			}
		} catch(err){
			sendchat("error","/w gm "+err,null,{noarchive:true});
		}
    }
}});
/* (flip_card.js) 201101 코드 종료 */
