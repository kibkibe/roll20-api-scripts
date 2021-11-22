/* https://github.com/kibkibe/roll20-api-scripts/tree/master/whisper_tap */
/* (whisper_tap.js) 211122 코드 시작 */

// define: option
const wt_setting = {
	// option: 핸드아웃에 저장되는 채팅로그에 플레이어의 고유색상을 적용할지의 여부를 설정합니다.
	// 0: 사용안함 / 1: 이름만 컬러 / 2: 채팅까지 컬러
	use_personal_color: 1,
	// option: 핸드아웃에 표시하는 채팅시각의 표준시간대를 지정합니다. 기본값은 KST(UTC+9)입니다.
	timezone: 9,
	// option: 가장 최근 채팅을 맨 밑에 표시할지(true) 맨 위에 표시할지(false) 설정합니다.
	asce_order: true
};
// /define: option

on('ready', function() {
	// on.ready
    if (!state.wt_launched) {
		state.wt_launched = true;
		state.wt_asce_order = wt_setting.asce_order;
	}
 	if (state.wt_asce_order != wt_setting.asce_order) {
	    state.wt_asce_order = wt_setting.asce_order;
		reverseWhisper();
 	}
	// /on.ready
});

on("chat:message", function(msg){
    if (msg.type == "whisper"){
		// on.chat:message:whisper
		const player = getObj('player',msg.playerid);
		if (player && (playerIsGM(msg.playerid) || msg.target == 'gm')) {
			const cha_name = playerIsGM(msg.playerid) ? msg.target_name : msg.who;
			let condition = {type:'handout',name:'귓속말('+cha_name+')'};
			let ho = findObjs(condition);
			if (ho.length > 0) {
				ho = ho[0];
				for (let i = 1; i < ho.length; i++) {
					ho[i].remove();
				}
			} else {
				const cha = findObjs({type:'character',name:cha_name});
				ho = createObj('handout',condition);
				if (cha.length > 0) {
					if (cha.length > 1) {
						sendChat('warning','/w "' + msg.who + '" 이름이 **' + cha_name + '**인 캐릭터가 ' + cha.length + '명 있습니다. 임의의 한 캐릭터를 기준으로 귓속말 핸드아웃의 권한을 부여합니다.',null,{noarchive:true});
						if (!playerIsGM(msg.playerid)) {
							sendChat('warning','/w gm 이름이 **' + cha_name + '**인 캐릭터가 ' + cha.length + '명 있습니다. 임의의 한 캐릭터를 기준으로 귓속말 핸드아웃의 권한을 부여합니다.',null,{noarchive:true});
						}
					}
					cha = cha[0];
					ho.set('inplayerjournals',cha.get('controlledby'));
				} else {
					ho.set('inplayerjournals',playerIsGM(msg.playerid)?msg.target:msg.playerid);
				}
			}

			let filtered = msg.content;
			let filter_word = [
				{regex:/\*.+\*/g,replace:/\*/g}, // *, **, ***
				{regex:/``.+``/g,replace:/``/g}, // ``
				{regex:/\[[^\(\)\[\]]*\]\(http[^\(\)\[\]]+\)/g,replace:/\[[^\(\)\[\]]*\]\(http[^\(\)\[\]]+\)/g}, // [](http...)
				{regex:/<[^>]*>/g,replace:/<[^>]*>/g}, // <html>
				{regex:/\(.{1}\" style=\"[^\)]+\)/g,replace:/\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)/g}, // [](#" style="...)
				{regex:/\$\[\[.+\]\]/g,replace:/\$\[\[.+\]\]/g}]; // [[]]
			for (let i=0;i<filter_word.length;i++) {
				let match = filtered.match(filter_word[i].regex);
				if (match) {
					for (let j=0;j<match.length;j++) {
						filtered = filtered.replace(match[j], match[j].replace(filter_word[i].replace,''));
					}
				}
			}
			
			let d = new Date();
			let tz = d.getTime() + (d.getTimezoneOffset() * 60000) + (wt_setting.timezone * 3600000);
			d.setTime(tz);
			let final_str = "<span style='color:#aaaaaa;font-size:7pt;'>"
					+ d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()
					+ "</span>" + "<br>"
					+ (wt_setting.use_personal_color!=0?("<span style='color:"+player.get('color')+";'>"):"") + "<b>"
					+ (playerIsGM(msg.playerid)?'GM':msg.who) + "</b>" + (wt_setting.use_personal_color===1?"</span>":"") + ": "
					+ filtered + (wt_setting.use_personal_color===2?"</span>":"");

			ho.get('notes',function(text) {
				let content = (text.length > 0 && text != 'null' ? text : "");
				if (wt_setting.asce_order) {
					content = content + "<br><i></i>" + final_str;
				} else {
					content = final_str + "<br><i></i>" + content;
				}
				setTimeout(function(){
					ho.set({notes: content});
				},100);
			});
		}
		// /on.chat:message:whisper
	}
});

// define: global function
function reverseWhisper() {
	let handouts = filterObjs(function(obj) {    
		if(obj.get("_type") == 'handout' && obj.get("name").startsWith('귓속말(') && obj.get("name").endsWith(')')) return true;    
		else return false;
	});
	for (let i = 0; i < handouts.length; i++) {
		const ho = handouts[i];
		ho.get('notes',function(text) {
			let split = text.split('<br><i></i>');
			if (split.length > 1) {
				split = split.reverse();
				let final_str = split.join('<br><i></i>');
				setTimeout(function(){
					ho.set({notes: final_str});
        		},100);
			}
		});
	}
}
// /define: global function
/* (whisper_tap.js) 211122 코드 종료 */