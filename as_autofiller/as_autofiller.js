/* https://github.com/kibkibe/roll20-api-scripts/tree/master/as_autofiller */
/* (as_autofiller.js) 210306 코드 시작 */

// define: global constant
const api_tag = '<a href="#vd-permitted-api-chat"></a>';
// /define: global constant

// define: option
const aa_setting = {
	// option: 토큰을 선택하지 않고 명령어를 사용했을 때 기본적으로 표시될 캐릭터의 이름을 설정합니다.
	master_name: "GM",
	// option: 플레이어에게 권한이 있는 캐릭터도 자동선택의 대상에 포함할지(true) 제외할지(false) 설정합니다.
	use_to_playable_character: false
}
// /define: option

on("chat:message", function(msg)
{
if (msg.type == "api"){
	// on.chat:message:api
	if (msg.content.indexOf("!!") === 0 && (msg.playerid == 'API' || playerIsGM(msg.playerid))) {
		try {
			let aa_command = "!!";
			let false_value = 9999;
			let keyword = msg.content.split(' ')[0];
			if (keyword) {
				if (keyword.length > aa_command.length) {
					keyword = keyword.replace("!!","");
					let characters = findObjs({type:'character'});
					let nearest_item = {idx:false_value,match_idx:false_value};
					for (let i=0;i<characters.length;i++) {
						let cha = characters[i];
						let controller = cha.get('controlledby').split(",");
						let is_npc = true;
						for (let j=0;j<controller.length;j++) {
							if (controller[j] == "all" || (controller[j].length > 0 && !playerIsGM(controller[j]))) {
								is_npc = false;
								break;
							}
						}
						if (is_npc || aa_setting.use_to_playable_character) {
							let match_idx = cha.get('name').indexOf(keyword);
							if (match_idx > -1 && match_idx < nearest_item.match_idx) {
								nearest_item = {idx:i,match_idx:match_idx};
							}
						}
					}
					if (nearest_item.idx != false_value) {
						sendChat("character|"+characters[nearest_item.idx].get('id'),
						msg.content.substring(aa_command.length+ keyword.length+1, msg.content.length)+(api_tag&&!msg.content.includes(api_tag)?api_tag:""));
					} else {
						sendChat("as_autofiller.js", "/w gm **" + keyword + "**가 이름에 포함된 NPC가 없습니다.",null,{noarchive:true});
					}
				} else {
					let chat_id = "";
					if (aa_setting.master_name.length == 0) {
						sendChat("system","/w gm 이름의 길이가 0글자인 캐릭터를 통해 API로 채팅할 경우 이름이 올바르게 출력되지 않아 익명의 공백이름으로 표시되었습니다. \
						아바타를 사용하면서 캐릭터의 이름을 보이지 않기를 원하실 경우 이름을 공백으로 두는 대신 **공백문자**(스페이스바 등)를 1글자 넣어주세요.",null,{noarchive:true});
					} else {
						const gm = findObjs({ name: aa_setting.master_name, type: 'character'})[0];
						if (gm) {
							chat_id = "character|"+gm.get("_id");
						} else {
							sendChat("system","/w gm **!!** 뒤에 입력한 키워드가 없고 이름이 '" + aa_setting.master_name + "'인 캐릭터가 저널에 없습니다.",null,{noarchive:true});
							return;
						}
					}
					sendChat(chat_id,msg.content.substring(3) +(!msg.content.includes(api_tag)?api_tag:""));
				}
			}
		} catch (err) {
			sendChat("error","/w gm " + err,null,{noarchive:true});
		}
	}
	// /on.chat:message:api
}
});
/* (as_autofiller.js) 210306 코드 종료 */