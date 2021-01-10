/* 설치법: https://github.com/kibkibe/roll20_api_scripts/wiki/%5B%EC%84%A4%EC%B9%98%EB%B2%95%5D-as_switcher.js */
/* (as_switcher.js) 201212 코드 시작 */
on("chat:message", function(msg)
{
if (msg.type == "api"){
    if (msg.content.indexOf("!! ") === 0) {
		try {
			if (msg.selected && msg.selected.length > 0) {
				var tok = getObj("graphic", msg.selected[0]._id);
				if (tok.get('represents') && tok.get('represents').length > 1) {
				    sendChat("character|"+tok.get('represents'),msg.content.substring(3));
				    return;
				}
			}
			var master_name = "GM"; //토큰을 선택하지 않고 명령어를 사용했을 때 기본적으로 표시될 캐릭터의 이름을 기입해주세요.
			var gm = findObjs({ name: master_name, type: 'character'})[0];
			if (gm) {
				sendChat("character|"+gm.get("_id"),msg.content.substring(3));
			} else {
				sendChat("system","/w gm 선택된 토큰이 없고 이름이 '" + master_name + "'인 캐릭터가 저널에 없습니다.",null,{noarchive:true});
			}
		} catch (err) {
			sendChat("error","/w gm " + err,null,{noarchive:true});
		}
	}
}
});
/* (as_switcher.js) 201212 코드 종료 */