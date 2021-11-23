/* https://github.com/kibkibe/roll20-api-scripts/tree/master/whisper_tap */
/* (whisper_tap.js) 211123 코드 시작 */

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
		let sender = getObj('player',msg.playerid);
		let cha = findObjs({type:'character',name:msg.who});
		if ((sender || cha.length > 0) && (playerIsGM(msg.playerid) || msg.target == 'gm')) {
			if (msg.playerid == 'API') {
				const controller = cha[0].get('controlledby');
				if (controller == 'all' || controller.split(',').length > 1) {
					sendChat("error","/w gm " + msg.who + ' 캐릭터의 권한을 가진 플레이어가 2명 이상입니다. 이 채팅을 어느 귓속말 핸드아웃에 저장할지를 특정할 수 없습니다.',null,{noarchive:true});
					return;
				} else {
					msg.playerid = cha[0].get('controlledby');
					sender = getObj('player',msg.playerid);
				}
			}
			const player = playerIsGM(msg.playerid) ? getObj('player',msg.target) : sender;
			let condition = {type:'handout',controlledby:player.get('_id').substring(1,player.get('_id').length)};
			let ho = findObjs(condition);
			if (ho.length > 0) {
				ho = ho[0];
				for (let i = 1; i < ho.length; i++) {
					ho[i].remove();
				}
			} else {
				condition.name = '귓속말(' + player.get('_displayname') + ')';
				condition.inplayerjournals = player.get('_id');
				ho = createObj('handout',condition);
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
					+ (wt_setting.use_personal_color!=0?("<span style='color:"+sender.get('color')+";'>"):"") + "<b>"
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
/* (whisper_tap.js) 211123 코드 종료 */