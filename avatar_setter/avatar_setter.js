/* https://github.com/kibkibe/roll20-api-scripts/tree/master/avatar_setter */
/* (avatar_setter.js) 210306 코드 시작 */
on("chat:message", function(msg)
{
if (msg.type == "api"){
	// on.chat:message:api
	if (msg.content.indexOf("!avatar ") == 0) {
		try {
			let chat_cha = findObjs({ _type: 'character', name: msg.who});
			if (chat_cha.length == 0) {
				sendChat("error", "이름이 **" + msg.who + "**인 캐릭터가 저널에 없습니다. *(이 안내메시지는 로그에 저장되지 않습니다.)*",null,{noarchive:true});
			} else {
				chat_cha = chat_cha[0];
				const current_avatar = chat_cha.get('avatar');
				if (msg.content.indexOf('https://') > -1) {
					chat_cha.set('avatar',msg.content.replace("!avatar ",''));
					if (current_avatar == chat_cha.get('avatar')) {
						sendChat("error", "**" + msg.who + "**의 아바타 이미지가 변경되지 않았습니다. 외부 링크를 사용했거나 올바르지 않은 주소인지 확인해주세요. *(이 안내메시지는 로그에 저장되지 않습니다.)*",null,{noarchive:true});
					}
				}
			}
		} catch (err) {
			sendChat("error","/w gm " + err,null,{noarchive:true});
		}
	}
	// /on.chat:message:api
}
});
/* (avatar_setter.js) 210306 코드 종료 */