/* https://github.com/kibkibe/roll20-api-scripts/tree/master/smallchat_split */
/* (smallchat_split.js) 210306 코드 시작 */

// define: option
let ss_setting = {
	// option: 채팅창의 글씨크기를 지정합니다.
	font_size: 14,
	// option: 채팅창의 글씨색을 지정합니다.
	color:"rgb(255, 255, 255)",
	// option: 채팅창의 상하좌우 여백을 설정합니다.
	margin: 5,
	// option: 채팅로그에 플레이어/PC 중 어느쪽 이름을 표시할지 지정합니다. (true:플레이어/false:PC)
	show_player_name: false,
	// option: 잡담 내역을 저장할 핸드아웃의 이름을 지정합니다.
	logname: '(잡담로그)',
	// option: 세션화면 안에 채팅창을 만들지 않고자 할 경우 실시간 채팅을 표시할 별도의 핸드아웃의 이름을 지정합니다.
	onair_name: '(실시간 잡담채팅)',
	// option: 실시간 채팅용 핸드아웃에서 최신순으로 몇개까지 채팅을 표시할지를 지정합니다.
	onair_lines: 15,
	// option: 핸드아웃에 저장되는 채팅로그에 플레이어의 고유색상을 적용할지의 여부를 설정합니다
	// 0: 사용안함 / 1: 이름만 컬러 / 2: 채팅까지 컬러
	use_personal_color: 1,
	// option: 핸드아웃에 표시하는 채팅시각의 표준시간대를 지정합니다. 기본값은 KST(UTC+9)입니다.
	timezone: 9,
	// option: (고급설정) 각 열이 간격이 font_size 대비 얼마만큼의 픽셀을 차지하는지의 비율을 지정합니다.
	lineheight: 1.7,
	// option: (고급설정) 각 글자가 font_size 대비 얼마만큼의 픽셀을 차지하는지의 비율을 지정합니다.
	letterspacing: 0.95
}
// /define: option

on('ready', function() {
	// on.ready
    if (!state.smallchatlog) state.smallchatlog = [];
    if (!state.smallchatonair) state.smallchatonair = [];
	// /on.ready
});
on("chat:message", function(msg)
{
if (msg.type == "api"){
	// on.chat:message:api
    if (msg.content.indexOf("! ") === 0) {
        try {
			let box = findObjs({ _type: 'text', layer:'map'});
			let bg = findObjs({ _type: 'graphic', name:'chat_bg', layer:'map'});
			let ho = findObjs({ _type: 'handout', name:ss_setting.logname});
			let player = getObj('player',msg.playerid);
			
			let split;
			if (bg.length > 0) {
				bg = bg[0];
			} else {
				bg = null;
			}
			if (ho.length > 0) {
				ho = ho[0];
			} else {
				ho = createObj('handout', {
					notes: ' ',
					inplayerjournals: 'all',
					name: ss_setting.logname
				});
			}
			if (bg) {
				let width = bg.get('width') - ss_setting.margin * 2;
				if (box.length > 0) {
					box = box[0];
					split = box.get('text').split('\n');
				} else {
					split = [''];
					while (bg.get('width')>split[0].length*ss_setting.font_size) { split[0] += "ㅤ"; }
					while (split.length * ss_setting.font_size * ss_setting.lineheight < bg.get('height') + ss_setting.margin*2) {
						split.push(' ');
					}
					box = createObj('text', {
						_pageid: bg.get('_pageid'),
						left: bg.get('left'),
						top: bg.get('top'),
						width: width,
						height: bg.get('height'),
						layer: 'map',
						font_family: 'Arial',
						text: '',
						font_size: ss_setting.font_size,
						color: ss_setting.color
					});
				}
				let str = player.get('_displayname') + ": " + msg.content.substring(2);
				let amount = Math.ceil(width/ss_setting.font_size/ss_setting.letterspacing*2);
				let idx = 0;
				let length = 0;
				let halfchar = [' ',',','.','\'','"','[',']','(',')','*','^','!','-','~',':',';','<','>','+','l','i','1'];
				for (let i=0;i<str.length;i++){
					let c = str[i];
					for (let j=0;j<halfchar.length;j++) {
						if (c==halfchar[j]) {
							length -= 1;
							break;
						}
					}
					length += 2;
					if (length > amount) {
						split.push(str.substring(idx,i));
						idx = i;
						length = 0;
					}
				}
				if (idx < str.length) {
					split.push(str.substring(idx,str.length));
				}
				while ((split.length -1) * ss_setting.font_size * ss_setting.lineheight > bg.get('height') + ss_setting.margin*2) {
					split.splice(1,1);
				}
				box.set({text:split.join('\n'),left:bg.get('left'),top:bg.get('top')-ss_setting.font_size});
				toFront(box);
			}
			let d = new Date();
			let tz = d.getTime() + (d.getTimezoneOffset() * 60000) + (ss_setting.timezone * 3600000);
			d.setTime(tz);
			let final_str = "<span style='color:#aaaaaa;font-size:7pt;'>"
					+ d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()
					+ "</span>" + "<br>"
					+ (ss_setting.use_personal_color!=0?("<span style='color:"+player.get('color')+";'>"):"") + "<b>"
					+ (ss_setting.show_player_name ? player.get('_displayname') : msg.who) + "</b>" + (ss_setting.use_personal_color===1?"</span>":"") + ": "
					+ msg.content.substring(2) + (ss_setting.use_personal_color===2?"</span>":"");
			if (!bg) {
				let oa = findObjs({ _type: 'handout', name:ss_setting.onair_name});
				if (oa.length > 0) {
					oa = oa[0];
				} else {
					oa = createObj('handout', {
						notes: ' ',
						inplayerjournals: 'all',
						name: ss_setting.onair_name
					});
				}
				oa.get('notes',function(text) {
					let final_split = (text.length > 0 && text != 'null' ? text.split("<br><i></i>") : []);
					final_split.push(final_str);
					if (final_split.length > ss_setting.onair_lines) {
						final_split.splice(0,1);
					}
					state.smallchatonair.push(final_split.join("<br><i></i>"));
					if (state.smallchatonair.length > 0) {
						oa.set({notes: state.smallchatonair[0]});
						state.smallchatonair.splice(0,1);
					}
				});
			}
			ho.get('notes',function(text) {
				state.smallchatlog.push((text.length > 0 && text != 'null' ? text : "") + "<br><i></i>" + final_str);
				if (state.smallchatlog.length > 0) {
					ho.set({notes: state.smallchatlog[0]});
					state.smallchatlog.splice(0,1);
				}
			});
		} catch (err) {
			sendChat('error','/w GM '+err,null,{noarchive:true});
		}
    }
	// /on.chat:message:api
}
});
/* (smallchat_split.js) 210306 코드 종료 */
