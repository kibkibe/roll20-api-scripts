/* https://github.com/kibkibe/roll20-api-scripts/tree/master/ruby_character */
/* (ruby_character.js) 210627 코드 시작 */

// define: global constant
state.api_tag = '<a href="#vd-permitted-api-chat"></a>';
// /define: global constant

// define: option
const rc_setting = {
	// option: 아래에 표시되는 글자에 기울임(이탤릭체)를 적용할지(true/false)를 설정합니다.
	text_italic: false,
	// option: 아래에 표시되는 글자에 굵은 글씨(볼드)를 적용할지(true/false)를 설정합니다.
	text_bold: false,
	// option: 위에 표시되는 루비문자에 기울임(이탤릭체)를 적용할지(true/false)를 설정합니다.
	ruby_italic: false,
	// option: 위에 표시되는 루비문자에 굵은 글씨(볼드)를 적용할지(true/false)를 설정합니다.
	ruby_bold: false
}
// /define: option

on("chat:message", function(msg)
{
if (msg.type == "api"){
	// on.chat:message:api
	if (msg.content.indexOf("!루 ") == 0 || msg.content.indexOf("!r ") == 0) {
		try {
			
			let str = msg.content.replace("!루 ",'').replace("!r ",'');
			const ruby_array = str.match(/\[[^\(\)\[\]]*\]\([^\(\)\[\]]+\)/g);
			if (ruby_array) {
				ruby_array.forEach(element => {
					const split = element.split('](');
					const rb = split[0].replace('[','');
					const rt = split[1].replace(')','');
					str = str.replace(element, '<div style="display:inline-block;vertical-align:bottom;">'
					+ '<div style="display:table"><div style="display:table-row;text-align:center;font-size:7pt;'
					+ (rc_setting.ruby_bold ? 'font-weight:bold;': '') + (rc_setting.ruby_italic ? 'font-style:italic;': '') + '"><span style="display:none">(</span>'
					+ rt + '<span style="display:none">)</span></div><div style="display:table-row;text-align:center;'
					+ (rc_setting.text_bold ? 'font-weight:bold;': '') + (rc_setting.text_italic ? 'font-style:italic;': '')
					+ '"><span style="display:none">[</span>' + rb + '<span style="display:none">]</span></div></div></div>');
				});
			} else {
				sendChat('error','/w "' + (msg.who==''?'GM':msg.who) + '" 루비 형식이 올바르지 않습니다.<br>``[아래에 표시될 문장]````(위에 표시될 문장)``의 형식으로 입력해주세요.',null,{noarchive:true});
				return;
			}

			const findCharacterWithName = function(who) {
			    if (who == "") {
					sendChat("system","/w gm 이름의 길이가 0글자인 캐릭터를 통해 API로 채팅할 경우 이름이 올바르게 출력되지 않아 익명의 공백이름으로 표시되었습니다. \
					아바타를 사용하면서 캐릭터의 이름을 보이지 않기를 원하실 경우 이름을 공백으로 두는 대신 **공백문자**(스페이스바 등)를 1글자 넣어주세요.",null,{noarchive:true});
			        return '';
			    }
				let chat_cha = findObjs({ _type: 'character', name: who});
				if (chat_cha.length > 0) {
					return "character|" + chat_cha[0].get('_id');
				} else {
				    let chat_pl = findObjs({ _type: 'player', name: who});
    				if (chat_pl.length > 0) {
    					return "player|" + chat_pl[0].get('_id');
    				} else {
					    return who;
    				}
				}
			}
			sendChat(str.includes('/desc')?'':findCharacterWithName(msg.who),str + state.api_tag);
		} catch (err) {
			sendChat('error','/w GM '+err,null,{noarchive:true});
		}
	}
	// /on.chat:message:api
}});
/* (ruby_character.js) 210627 코드 종료 */