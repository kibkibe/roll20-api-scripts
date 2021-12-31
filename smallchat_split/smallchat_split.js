/* https://github.com/kibkibe/roll20-api-scripts/tree/master/smallchat_split */
/* (smallchat_split.js) 211122 코드 시작 */

// define: option
let ss_setting = {
	// option: 맵에 채팅창을 표시할지(true) 별도의 핸드아웃에 실시간 채팅을 표시할지(false) 설정합니다.
	show_chat_window: false,
	// option: 세션 진행 중 채팅창에 흐린 색의 잡담을 일시적으로 표시할지(true) 표시하지 않을지(false) 설정합니다. 일시적으로 표시한 내용은 채팅 기록엔 남지 않습니다.
	show_chat_log: false,
	// option: 채팅창의 글씨크기를 지정합니다.
	font_size: 14,
	// option: 채팅창의 글씨색을 지정합니다.
	color: "rgb(255, 255, 255)",
	// option: 채팅창의 상하좌우 여백을 설정합니다. (글자 크기와 줄 개수에 의존하기 때문에 정확하게 입력한대로 배치되지 않습니다. 의도하는 레이아웃에 맞춰 위치를 조금씩 조정하는데 사용하세요.)
	margin: {top:40,right:30,bottom:20,left:30},
	// option: 채팅로그에 플레이어/PC 중 어느쪽 이름을 표시할지 지정합니다. (true:플레이어/false:PC)
	show_player_name: false,
	// option: 잡담 내역을 저장할 핸드아웃의 이름을 지정합니다.
	logname: "(잡담로그)",
	// option: 실시간 채팅을 표시할 별도의 핸드아웃의 이름을 지정합니다.
	onair_name: "(실시간 잡담채팅)",
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
	letterspacing: 0.85
}
// /define: option

on("chat:message", function(msg)
{
if (msg.type == "api"){
	// on.chat:message:api
    if (msg.content.indexOf("! ") === 0) {
        try {
			let bg_array = findObjs({ _type: 'graphic', name:'chat_bg', layer:'map'});
			let ho = findObjs({ _type: 'handout', name:ss_setting.logname});
			let player = getObj('player',msg.playerid);
			
			let split;
			if (bg_array.length < 1 && ss_setting.show_chat_window) {
				sendChat('error','/w GM **\'map\'**레이어에 이름이 **\'chat_bg\'**인 토큰이 없습니다.',null,{noarchive:true});
				return;
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

			let filtered = msg.content.substring(2);
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

			if (ss_setting.show_chat_window) {
				for (let i = 0; i < bg_array.length; i++) {
					const bg = bg_array[i];
					let rect;
					try {
						rect = JSON.parse(bg.get('gmnotes'));
					} catch (err) {
						rect = {};
					}
					let box = getObj('text', rect.textid);
					const fillWidthBlank = function() {
						let str = "";
						while (bg.get('width')>str.length*ss_setting.font_size*1.2) { str += " "; }
						return str;
					}
					const fillHeightBlank = function(split) {
		
						while (split.length * ss_setting.font_size * ss_setting.lineheight < bg.get('height') - ss_setting.margin.top - ss_setting.margin.bottom) {
							split.splice(1,0,' ');
						}
					}
					let width = bg.get('width') - ss_setting.margin.left - ss_setting.margin.right;
					if (box) {
						let str = box.get('text');
						let sizeChanged = false;
							if (rect.left != bg.get('left')+ss_setting.margin.left || rect.top != bg.get('top')+ss_setting.margin.top
							|| rect.margin_left != ss_setting.margin.left || rect.margin_right != ss_setting.margin.right
							|| rect.width != bg.get('width') || rect.height != bg.get('height')) {
								sizeChanged = true;
								str = str.replace(/ㅤ+/,fillWidthBlank());
							}
						split = str.split('\n');
						if (sizeChanged) {
							fillHeightBlank(split);
						}
					} else {
						split = [''];
						split[0] = fillWidthBlank();
						fillHeightBlank(split);
						box = createObj('text', {
							_pageid: bg.get('_pageid'),
							left: bg.get('left') + ss_setting.margin.left,
							top: bg.get('top') + ss_setting.margin.top,
							width: width,
							height: bg.get('height'),
							layer: 'map',
							font_family: 'Arial',
							text: '',
							font_size: ss_setting.font_size,
							color: ss_setting.color
						});
					}
					let str = (ss_setting.show_player_name ? player.get('_displayname') : msg.who) + ": " + filtered;
					let amount = Math.ceil(width/ss_setting.font_size/ss_setting.letterspacing*3);
					let idx = 0;
					let length = 0;
	
					const thirdchar = ['\'',' ',',','.','!',':',';','"'];
					const halfchar = ['[',']','(',')','*','^','-','~','<','>','+','l','i','1'];
					const arr = thirdchar.concat(halfchar);
					for (let i=0;i<str.length;i++){
						let c = str[i];
						length += 3;
						for (let j=0;j<arr.length;j++) {
							if (c==arr[j]) {
								length -= (j<thirdchar.length ? 2 : 1);
								break;
							}
						}
						if (length > amount) {
							split.push(str.substring(idx,i));
							idx = i;
							length = 0;
						}
					}
					if (idx < str.length) {
						split.push(str.substring(idx,str.length));
					}
					while ((split.length -1) * ss_setting.font_size * ss_setting.lineheight > bg.get('height') - ss_setting.margin.top - ss_setting.margin.bottom) {
						split.splice(1,1);
					}
					let note_str = "{\"left\":"+(bg.get('left')+ss_setting.margin.left)+",\"top\":"+(bg.get('top')+ss_setting.margin.top-ss_setting.font_size)+",\"margin_left\":"
					+ss_setting.margin.left+",\"margin_right\":"+ss_setting.margin.right+",\"width\":"+bg.get('width')+",\"height\":"+bg.get('height')+",\"textid\":\""
					+box.get('_id')+"\"}";
					box.set({text:split.join('\n'),
					left:bg.get('left')-(bg.get('width')/2)+(bg.get('width')-ss_setting.margin.left-ss_setting.margin.right)/2+ss_setting.margin.left,
					top:bg.get('top')-(bg.get('height')/2)+(bg.get('height')-ss_setting.margin.top-ss_setting.margin.bottom)/2+ss_setting.margin.top-ss_setting.font_size});
					bg.set("gmnotes",note_str);
					toFront(box);
				}
			}
			if (ss_setting.show_chat_log) {
				const style = "color:#aaaaaa";
				let chat_id = "";
				if (!ss_setting.show_player_name) {
					let character = findObjs({type:'character',name:msg.who});
					if (character.length > 0) {
						chat_id = "character|" + character[0].get('_id');
					}
				}
				chat_id = chat_id ? chat_id : "player|"+msg.playerid;
				sendChat(chat_id,"<span style='" + style + "'>"+msg.content.substring(2, msg.content.length)+"</span>",null,{noarchive:true});
			}
			let d = new Date();
			let tz = d.getTime() + (d.getTimezoneOffset() * 60000) + (ss_setting.timezone * 3600000);
			d.setTime(tz);
			let final_str = "<span style='color:#aaaaaa;font-size:7pt;'>"
					+ d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()
					+ "</span>" + "<br>"
					+ (ss_setting.use_personal_color!=0?("<span style='color:"+player.get('color')+";'>"):"") + "<b>"
					+ (ss_setting.show_player_name ? player.get('_displayname') : msg.who) + "</b>" + (ss_setting.use_personal_color===1?"</span>":"") + ": "
					+ filtered + (ss_setting.use_personal_color===2?"</span>":"");
			if (!ss_setting.show_chat_window) {
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
					setTimeout(function(){
						oa.set({notes: final_split.join("<br><i></i>")});
					},100);
				});
			}
			ho.get('notes',function(text) {
				setTimeout(function(){
					ho.set({notes: (text.length > 0 && text != 'null' ? text : "") + "<br><i></i>" + final_str});
				},100);
			});
		} catch (err) {
			sendChat('error','/w GM '+err,null,{noarchive:true});
		}
    }
	// /on.chat:message:api
}
});
/* (smallchat_split.js) 211122 코드 종료 */
