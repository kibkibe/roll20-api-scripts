/* https://github.com/kibkibe/roll20-api-scripts/tree/master/as_switcher */
/* (as_switcher.js) 210306 코드 시작 */

// define: option
const as_setting = {
	// option: 토큰을 선택하지 않고 명령어를 사용했을 때 기본적으로 표시될 캐릭터의 이름을 기입해주세요.
	master_name: "GM"
}
// /define: option

on("chat:message", function(msg)
{
if (msg.type == "api"){
	// on.chat:message:api
    if (msg.content.indexOf("!! ") === 0 && (msg.playerid == 'API' || playerIsGM(msg.playerid))) {
		try {
			const api_tag = '<a href="#vd-permitted-api-chat"></a>';
			let target_cha = null;
			if (msg.selected && msg.selected.length > 0) {
				var tok = getObj("graphic", msg.selected[0]._id);
				if (tok.get('represents') && tok.get('represents').length > 1) {
					target_cha = getObj('character',tok.get('represents'));
					cha_id = "character|"+tok.get('represents');
				}
			} else {
				let gm = findObjs({ name: as_setting.master_name, type: 'character'});
				if (gm.length > 0) {
					target_cha = gm[0];
				} else {
					sendChat("system","/w gm 선택된 토큰이 없고 이름이 '" + as_setting.master_name + "'인 캐릭터가 저널에 없습니다.",null,{noarchive:true});
				}
			}
			if (target_cha) {
				if (target_cha.get('name').length == 0) {
					sendChat('',msg.content.replace('!! ','')+api_tag);
					sendChat("system","/w gm 이름의 길이가 0글자인 캐릭터를 통해 API로 채팅할 경우 이름이 올바르게 출력되지 않아 익명의 공백이름으로 표시되었습니다. \
					아바타를 사용하면서 캐릭터의 이름을 보이지 않기를 원하실 경우 이름을 공백으로 두는 대신 **공백문자**(스페이스바 등)를 1글자 넣어주세요.",null,{noarchive:true});
				} else {
					sendChat("character|"+target_cha.get('_id'),msg.content.replace('!! ','')+api_tag);
				}
			} else {
				sendChat("system","/w gm 선택된 토큰이 없거나 이 토큰과 연결된 캐릭터가 없습니다.",null,{noarchive:true});
			}
		} catch (err) {
			sendChat("error","/w gm " + err,null,{noarchive:true});
		}
	}
	// /on.chat:message:api
}
});
/* (as_switcher.js) 210306 코드 종료 */