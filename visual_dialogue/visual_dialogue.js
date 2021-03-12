/* https://github.com/kibkibe/roll20-api-scripts/tree/master/visual_dialogue */
/* (visual_dialogue.js) 210312 코드 시작 */

// define: global constant
const api_tag = "<a href=\"#vd-permitted-api-chat\"></a>";
const vd_divider = "ℍ";
// /define: global constant

// define: option
const vd_setting = {
	// option: 한 화면에 표시할 수 있는 스탠딩 이미지의 최대 개수를 설정합니다.
	// 이 숫자를 넘어가면 엑스트라, 혹은 채팅기록이 가장 오래된 캐릭터의 스탠딩이 삭제되고 그 위치에 새 스탠딩이 추가됩니다.
	max_number: 5,
	// option: 표시할 스탠딩 이미지들의 가로 사이즈입니다.
	width: 420,
	// option: 표시할 스탠딩 이미지들의 세로 사이즈입니다.
	height: 420,
	// option: 스탠딩 이미지의 가로 너비 중 화면 밖으로 빠져나가지 않도록 보장할 가로 사이즈입니다.
	fit_width: 200,
	// option: 캐릭터들이 여러 감정표현을 사용할지(true) 대표 스탠딩 하나만 사용할지(false) 설정합니다.
	// false일 경우 deck_name에 설정한 카드 덱에서 모든 캐릭터의 스탠딩 이미지를 가져옵니다.
	use_emotion: true,
	// option: /as를 이용해 저널에 없는 캐릭터로 채팅할 경우 엑스트라 전용 스탠딩을 표시할지 (true) 스탠딩을 생략할지(false) 설정합니다.
	// true일 경우 extra_name에 설정한 이름에 따라 엑스트라용 스탠딩을 가져옵니다.
	show_extra_standing: true,
	// option: use_emotion가 false일 경우에 캐릭터의 스탠딩 이미지를 가져올 카드덱의 이름을 설정합니다.
	deck_name: "standings",
	// option: use_emotion이 true일 경우에 엑스트라용 스탠딩 이미지를 가져올 카드덱의 이름을 설정합니다.
	extra_name: "extra",
	// option: show_extra_standing 옵션과 별개로 스탠딩을 표시하지 않을 캐릭터의 이름을 기입합니다. 여러개일 경우 콤마(,)로 구분합니다.
	ignore_list: "GM",
	// option: 스크립트를 사용할 페이지의 이름을 지정합니다. 여러개일 경우 콤마(,)로 구분합니다.
	// 페이지가 여럿일 경우 Player 북마크가 설정된 페이지에 우선적으로 대사가 표시됩니다.
	page_list: "conversation,intro",
	// option: 캐릭터의 이름이 표시되는 텍스트 박스의 폰트 사이즈를 설정합니다.
	name_font_size: 18,
	// option: 캐릭터 이름의 글씨색을 설정합니다.
	name_font_color: "rgb(255, 255, 255)",
	// option: 대사 내용이 표시되는 텍스트 박스의 폰트 사이즈를 설정합니다.
	dialogue_font_size: 16,
	// option: 대사 내용의 글씨색을 설정합니다.
	dialogue_font_color: "rgb(255, 255, 255)",
	// option: /desc나 /em으로 표시되는 강조된 텍스트 박스의 폰트 사이즈를 설정합니다.
	desc_font_size: 20,
	// option: /desc, /em의 글씨색을 설정합니다.
	desc_font_color: "rgb(255, 255, 255)",
	// option: 한번에 여러 채팅이 몰려서 순차적으로 표시해야 할 경우 채팅당 최소 노출시간을 설정합니다. (1000=1초)
	min_showtime: 1000,
	// option: 채팅 1글자당 표시 시간. 숫자가 커질수록 글자수 대비 대사의 표시시간이 길어집니다.
	showtime_ratio: 20,
	// option: (고급설정) 각 열이 간격이 font_size 대비 얼마만큼의 픽셀을 차지하는지의 비율을 지정합니다.
	line_height: 1.7,
	// option: (고급설정) 각 글자가 font_size 대비 얼마만큼의 픽셀을 차지하는지의 비율을 지정합니다.
	letter_spacing: 0.85
};
// /define: option

on('ready', function() {
	// on.ready
    state.vd_stock = [];
	// /on.ready
});
on("destroy:graphic", function(obj) {
	// on.destroy:graphic
    if (obj.get('name') == "vd_standing") {
        arrangeStandings(false);
    }
	// /on.destroy:graphic
});
on("chat:message", function(msg)
{
	// on.chat:message
	if ((msg.type == "general" || msg.type == "desc" || msg.type == "emote")
		&& (msg.playerid != 'API' || msg.content.includes(api_tag))
		&& !msg.rolltemplate){
		
		if (findCharacterWithName(msg.who) || findObjs({_type:'player',_displayname:msg.who.replace(' (GM)','')}).length == 0) {
			if (msg.content.length > 0) {
				msg.content = msg.content.replace(api_tag,'').replace(/<br>/g,vd_divider);
				msg.time = new Date().getTime();
				state.vd_stock.push(msg);
				if (state.vd_stock.length == 1) {
					setTimeout(showDialogue, 100);
				}
			} 
		}

	}
	// /on.chat:message
	// on.chat:message:api
	if (msg.type == "api" && msg.content.indexOf("!@") === 0) {

		const current_page_id = vdGetCurrentPage();
		if (!current_page_id) {
			return;
		}

		if (msg.content == '!@숨김' || msg.content == '!@hide') {

			showHideDecorations('vd_deco',false);
			showHideDecorations('vd_panel',false);
			let bg_name = findObjs({ _type: 'graphic', name:'vd_name', _pageid:current_page_id});
			let bg_dialogue = findObjs({ _type: 'graphic', name:'vd_dialogue', _pageid:current_page_id});
			if (bg_name.length > 0) {
				bg_name = bg_name[0];
			} else {
				sendChat("error","/w gm **" + getObj('page',current_page_id).get('name') + "** 페이지에 vd_name 토큰이 없습니다.",null,{noarchive:true});
				return;
			}
			if (bg_dialogue.length > 0) {
				bg_dialogue = bg_dialogue[0];
			} else {
				sendChat("error","/w gm **" + getObj('page',current_page_id).get('name') + "** 페이지에 vd_dialogue 토큰이 없습니다.",null,{noarchive:true});
				return;
			}
			let text_name = getObj('text', bg_name.get('gmnotes'));
			let text_dialogue = getObj('text', bg_dialogue.get('gmnotes'));
			text_name.remove();
			text_dialogue.remove();
			sendChat('vd-api-wildcard','!@퇴장:전원');

		} else if (msg.content.indexOf("!@퇴장") == 0 || msg.content.indexOf("!@exit") == 0) {

			const keyword = msg.content.replace("!@퇴장","").replace("!@exit","").replace(api_tag,'');

			if (keyword.length == 0) {
				removeStanding(msg);
			} else if (playerIsGM(msg.playerid) || msg.playerid == 'API' || msg.who == 'vd-api-wildcard') {
				if (keyword == ":전원" || keyword == ":전체" || keyword == ":all") {
					let tokens = findObjs({ _type: 'graphic', name: 'vd_standing', _pageid: current_page_id});
					tokens.forEach(token => {
						token.remove();
					});
				} else if (keyword == ":엑스트라" || keyword == ":extra") {
					let tokens = findObjs({ _type: 'graphic', name: 'vd_standing', represents: '', _pageid: current_page_id});
					tokens.forEach(token => {
						token.remove();
					});
				} else {
					msg.who = keyword.replace(":","");
					removeStanding(msg);
				}
			}

		} else if (vd_setting.use_emotion) {

			let cha_name = msg.who;
			let content_str = msg.content.replace(api_tag,'').replace('!@','');
			let emot = content_str;
			if (content_str.lastIndexOf(':') > -1 && (playerIsGM(msg.playerid) || msg.playerid == 'API')) {
				cha_name = content_str.substring(0,content_str.lastIndexOf(':'));
				emot = content_str.substring(content_str.lastIndexOf(':')+1,content_str.length);
			}
			let chat_cha = findCharacterWithName(cha_name);
			let current_token = null;
			if (chat_cha || vd_setting.show_extra_standing) {
				current_token = findTokenWithCharacter(chat_cha?chat_cha.get('_id'):'', cha_name);
			}
			if (current_token) {
				let nm = chat_cha?cha_name:vd_setting.extra_name;
				let rt = findObjs({ _type: 'deck', name: !vd_setting.use_emotion?vd_setting.deck_name:nm});
				if (rt.length == 0) {
					if (!vd_setting.use_emotion) {
						sendChat("error","/w gm 이름이 **" + vd_setting.deck_name +"**인 카드 덱이 없습니다.",null,{noarchive:true});
					} else {
						sendChat("error","/w gm 이름이 **" + nm + "**인 카드 덱이 없습니다.",null,{noarchive:true});
					}
					return;
				} else {

					let opt = {
						name: 'vd_standing',
						_subtype: 'card',
						_pageid: current_token.get('_pageid'),
						width: vd_setting.width,
						height: vd_setting.height,
						bar1_value: cha_name,
						left:current_token.get('left'),
						top:current_token.get('top'),
						layer: 'map',
						represents: chat_cha? chat_cha.get('_id'): '',
						tint_color: current_token.get('tint_color')
					};
					if (emot.length == 0) {
						opt.imgsrc = rt[0].get('avatar').replace('med','thumb').replace('max','thumb');
					} else {
						let search_opt = { _type: 'card', _deckid: rt[0].get('_id')};
						if (!vd_setting.use_emotion) {
							search_opt.name = chat_cha ? cha_name : vd_setting.extra_name;
						} else if (emot.length > 0) {
							search_opt.name = emot;
						}
						let rt_items = findObjs(search_opt);
						if (rt_items.length > 0) {
							opt.imgsrc = rt_items[0].get('avatar').replace('med','thumb').replace('max','thumb');
						} else {
							if (!vd_setting.use_emotion) {
								sendChat("error","/w gm **"+ vd_setting.deck_name + "** 카드 덱에 이름이 **" + opt.name + "**인 카드가 없습니다.",null,{noarchive:true});
							} else {
								sendChat("error","/w gm **" + rt[0].get('name') + "** 카드 덱에 이름이 **" + emot + "**인 카드가 없습니다.",null,{noarchive:true});
							}
							return;
						}
					}
					current_token.set(opt);
				}
			} else {
				sendChat("error","/w \"" + msg.who + "\" 이름이 **" + cha_name +"**인 캐릭터가 없습니다.",null,{noarchive:true});
			}
		}    
	}
	// /on.chat:message:api
});
// define: global function
const vdGetCurrentPage = function() {

	const page_list = vd_setting.page_list.replace(/, /g,',').replace(/ ,/g,',').split(',');
	if (page_list.indexOf(getObj('page',Campaign().get("playerpageid")).get('name')) > -1) {
		return Campaign().get("playerpageid");
	} else {
		const page = findObjs({type:'page',name:page_list[0]});
		if (page.length > 0) {
			return page[0].get('_id');
		} else {
			sendChat("error","/w gm 이름이 **" + page_list[0] + "**인 페이지가 없습니다.",null,{noarchive:true});
		}
	}
}

const showDialogue = function() {

    let msg = state.vd_stock[0];

    for (let index = 1; index < state.vd_stock.length; index++) {
        const element = state.vd_stock[index];
        if (element.who == msg.who && Math.abs(element.time - msg.time) < 100) {
            msg.content = msg.content + vd_divider + element.content;
            state.vd_stock.splice(index,1);
            index--;
        } else {
            break;
        }
    }

	const current_page_id = vdGetCurrentPage();
	if (!current_page_id) {
		return;
	}

    let is_general = msg.type == "general";
    const font_color = vd_setting[is_general?'dialogue_font_color':'desc_font_color'];
    let font_size = vd_setting[is_general ? 'dialogue_font_size' : 'desc_font_size'];
    let bg_area = findObjs({ _type: 'graphic', name:'vd_area', _pageid:current_page_id});
    let bg_name = findObjs({ _type: 'graphic', name:'vd_name', _pageid:current_page_id});
    let bg_dialogue = findObjs({ _type: 'graphic', name:'vd_dialogue', _pageid:current_page_id});
    let bg_panel = findObjs({ _type: 'graphic', name:'vd_panel', _pageid:current_page_id});
    let split = [];
    
    if (bg_area.length > 0) {
        bg_area = bg_area[0];
    } else {
        sendChat("error","/w gm **" + getObj('page',current_page_id).get('name') + "** 페이지에 vd_area 토큰이 없습니다.",null,{noarchive:true});
        showNextDialogue();
        return;
    }
    if (bg_name.length > 0) {
        bg_name = bg_name[0];
    } else {
        sendChat("error","/w gm **" + getObj('page',current_page_id).get('name') + "** 페이지에  vd_name 토큰이 없습니다.",null,{noarchive:true});
        showNextDialogue();
        return;
    }
    if (bg_dialogue.length > 0) {
        bg_dialogue = bg_dialogue[0];
    } else {
        sendChat("error","/w gm **" + getObj('page',current_page_id).get('name') + "** 페이지에  vd_dialogue 토큰이 없습니다.",null,{noarchive:true});
        showNextDialogue();
        return;
    }
    if (bg_panel.length > 0) {
        bg_panel = bg_panel[0];
    } else {
        sendChat("error","/w gm **" + getObj('page',current_page_id).get('name') + "** 페이지에  vd_panel 토큰이 없습니다.",null,{noarchive:true});
        showNextDialogue();
        return;
    }
    const width = bg_dialogue.get('width');
    const name_width = bg_name.get('width');
    let blank_name = '';
    let blank_dialogue = '';
    let text_name = getObj('text', bg_name.get('gmnotes'));
    let text_dialogue = getObj('text', bg_dialogue.get('gmnotes'));
    while (name_width > blank_name.length*vd_setting['name_font_size']*vd_setting['letter_spacing']) { blank_name += "ㅤ"; }
    while (width>blank_dialogue.length*font_size*vd_setting['letter_spacing']) { blank_dialogue += "ㅤ"; }

    if (text_name && text_name.get('_pageid') != current_page_id) {
        text_name.remove();
        text_name = null;
    }
    if ((text_dialogue && (text_dialogue.get('font_size') != font_size || text_dialogue.get('color') != font_color))
    || (text_dialogue && text_dialogue.get('_pageid') != current_page_id)) {
        text_dialogue.remove();
        text_dialogue = null;
    } 
    
    if (!text_name) {
        text_name = createObj('text', {
            _pageid: bg_area.get('_pageid'),
            left: bg_name.get('left'),
            top: bg_name.get('top'),
            width: bg_name.get('width'),
            height: bg_name.get('height'),
            layer: 'objects',
            font_family: 'Arial',
            text: '',
            font_size: vd_setting['name_font_size'],
            color: vd_setting['name_font_color']
        });
        bg_name.set({'gmnotes':text_name.get('_id')});
    }
    if (!text_dialogue) {        
        text_dialogue = createObj('text', {
            _pageid: bg_dialogue.get('_pageid'),
            left: bg_dialogue.get('left'),
            top: bg_dialogue.get('top'),
            width: width,
            height: bg_dialogue.get('height'),
            layer: 'objects',
            font_family: 'Arial',
            text: '',
            font_size: font_size,
            color: font_color
        });
        bg_dialogue.set({'gmnotes':text_dialogue.get('_id')});
    }

    // 예외처리할 텍스트 제외
    let name = msg.who + '\n' + blank_name;
    let str = msg.content;
    let filter_word = [
        {regex:/\*.+\*/g,replace:/\*/g}, // *, **, ***
        {regex:/``.+``/g,replace:/``/g}, // ``
        {regex:/\[[^\(\)\[\]]*\]\(http[^\(\)\[\]]+\)/g,replace:/\[[^\(\)\[\]]*\]\(http[^\(\)\[\]]+\)/g}, // [](http...)
        {regex:/<[^>]*>/g,replace:/<[^>]*>/g}, // <html>
        {regex:/\$\[\[.+\]\]/g,replace:/\$\[\[.+\]\]/g}]; // [[]]
    for (let i=0;i<filter_word.length;i++) {
        let match = str.match(filter_word[i].regex);
        if (match) {
            for (let j=0;j<match.length;j++) {
                str = str.replace(match[j], match[j].replace(filter_word[i].replace,''));
            }
        }
    }
    let ruby_match = str.match(/\([^\(\)\[\]]+\)\[[^\(\)\[\]]*\]/g);
    if (ruby_match) {
        for (let j=0;j<ruby_match.length;j++) {
            let rubystr_split = ruby_match[j].substring(1,ruby_match[j].length-1).split(')[');
            str = str.replace(ruby_match[j], rubystr_split[1]+"("+rubystr_split[0]+")");
        }
    }

    if (str.length == 0){
        showNextDialogue();
        return;
    }

    let desc_ratio = is_general ? 1 : 0.8;
    let amount = Math.ceil(width/font_size/vd_setting['letter_spacing']*3) -3;
    let idx = 0;
    let length = 0;
    const thirdchar = ['\'',' ',',','.','!',':',';','"'];
    const halfchar = ['[',']','(',')','*','^','-','~','<','>','+','l','i','1'];
    const arr = thirdchar.concat(halfchar);
    let divided = false;
    for (let i=0;i<str.length;i++){
        let c = str[i];
        length += 3;
        for (let j=0;j<arr.length;j++) {
            if (c==arr[j]) {
                length -= (j<thirdchar.length ? 2 : 1);
                break;
            }
        }
        if (length >= amount * desc_ratio || c == vd_divider) {
            let substr = str.substring(idx,i+1).replace(vd_divider,'');
            split.push(is_general || msg.who.length > 0 ? substr:getStringWithMargin(amount,length,desc_ratio,substr));
            idx = i+1;
            length = 0;
            if ((split.length+1) * font_size * vd_setting['letter_spacing']*3 > bg_dialogue.get('height')) {
                state.vd_stock.splice(1,0,{content:msg.content.substring(idx,str.length),time:msg.time,playerid:msg.playerid,type:msg.type,who:msg.who});
                divided = true;
                break;
            }
        }
    }
    if (idx < str.length && !divided) {
        let substr = str.substring(idx,str.length);
        split.push(is_general || msg.who.length > 0 ? substr:getStringWithMargin(amount,length,desc_ratio,substr));
    } 

    if (is_general || msg.who.length > 0) {
        while ((split.length+1) * font_size * vd_setting['line_height'] < bg_dialogue.get('height')) {
            split.push(' ');
        }
    } else {
        split.splice(0,0,' ');
    }
    split.push(blank_dialogue);
    text_name.set({text:name,left:bg_name.get('left'),
    top:bg_name.get('top')+vd_setting['name_font_size']*vd_setting['line_height']/2});
    text_dialogue.set({text:split.join('\n'),
    left: msg.type == 'desc' ? bg_panel.get('left'):bg_dialogue.get('left'),
    top: msg.type == 'desc'? bg_panel.get('top'):bg_dialogue.get('top')});

    showHideDecorations('vd_deco',msg.type != 'desc');
    showHideDecorations('vd_panel',true);

    toFront(bg_panel);
    toFront(text_name);
    toFront(text_dialogue);
    setTimeout(() => {
        toFront(bg_panel);
        toFront(text_name);
        toFront(text_dialogue);
    }, 100);

    const ignore_list = vd_setting.ignore_list.replace(/, /g,',').replace(/ ,/g,',').split(',');
    if (msg.type != "desc" && ignore_list.indexOf(msg.who) < 0) {
        let chat_cha = findCharacterWithName(msg.who);
        let current_token = null;
        if (chat_cha || vd_setting.show_extra_standing) {
            current_token = findTokenWithCharacter(chat_cha?chat_cha.get('_id'):'', msg.who);
        }
        let tokens = findObjs({ _type: 'graphic', name: 'vd_standing', _pageid: current_page_id});
        let lowest_priority = tokens[0];
        for (var i=0;i<tokens.length;i++) {
            var token = tokens[i];
            token.set('tint_color','#000000');
            if (parseInt(token.get('gmnotes')) < parseInt(lowest_priority.get('gmnotes'))) {
                lowest_priority = token;
            }
        }

        if (current_token == null && (chat_cha || vd_setting.show_extra_standing)) {
            let nm = chat_cha?msg.who:vd_setting.extra_name;
            let rt = findObjs({ _type: 'deck', name: !vd_setting.use_emotion? vd_setting.deck_name :nm});
            if (rt.length == 0) {
                if (!vd_setting.use_emotion) {
                    sendChat("error","/w gm 이름이 **"+ vd_setting.deck_name + "**인 카드 덱이 없습니다.",null,{noarchive:true});
                } else {
                    sendChat("error","/w gm 이름이 **" + msg.who + "**인 카드 덱이 없습니다.",null,{noarchive:true});
                }
                showNextDialogue();
                return;
            } else {
                let opt = {
                    name: 'vd_standing',
                    _pageid: bg_area.get('_pageid'),
                    width: vd_setting.width,
                    height: vd_setting.height,
                    bar1_value: msg.who,
                    layer: 'gmlayer',
                    imgsrc: rt[0].get('avatar').replace('med','thumb').replace('max','thumb'),
                    represents: chat_cha? chat_cha.get('_id'): ''
                };
                if (!chat_cha || !vd_setting.use_emotion) {
                    const extra_std = findObjs({ _type: 'card', _deckid: rt[0].get('_id'), name: msg.who});
                    if (extra_std.length > 0) {
                        opt.imgsrc = extra_std[0].get('avatar').replace('med','thumb').replace('max','thumb');
                    }
                }
        
                if (tokens.length >= vd_setting.max_number) {
                    opt.left = lowest_priority.get('left');
                } else {
                    opt.left = arrangeStandings(true);
                }
                opt.top = bg_area.get('top');

                if (tokens.length >= vd_setting.max_number) {
                    lowest_priority.set(opt);
                    current_token = lowest_priority;
                } else {
                    current_token = createObj('graphic', opt);
                }
                toFront(current_token);
                setTimeout(() => {
                    current_token.set({tint_color:'transparent',gmnotes:Date.now(),layer:"map"});
                }, 100);
            }
        } else {
            toFront(current_token);
            current_token.set({tint_color:'transparent',gmnotes:Date.now()});
        }
    }
    setTimeout(showNextDialogue, Math.max(vd_setting.min_showtime, str.length * vd_setting.showtime_ratio));
}

const showHideDecorations = function(name, show) {

    const text_deco = findObjs({name: name, _type: 'graphic'});
    for (let index = 0; index < text_deco.length; index++) {
        const itm = text_deco[index];
        if (show) {
            if (itm.get('gmnotes').includes('/')) {
                const wh = itm.get('gmnotes').split('/');
                itm.set({width:parseInt(wh[0]),height:parseInt(wh[1]),layer:'objects'});
            }
        } else {
            if (itm.get('gmnotes').length == 0) {
                itm.set({gmnotes:itm.get('width')+"/"+itm.get('height')});
            }
            itm.set({width:1,height:1,layer:'gmlayer'});
        }
    }
}
const showNextDialogue = function() {
    state.vd_stock.splice(0,1);
    if (state.vd_stock.length > 0) {
        showDialogue();
    }    
}
const getStringWithMargin = function(amount, length, ratio, str) {

    let margin = Math.round((amount - length)/4*ratio);
    for (var j=0;j<margin;j++){
        str = "ㅤ" + str + "ㅤ"; 
    }
    return str;
}  
const findCharacterWithName = function(who) {
    let chat_cha = findObjs({ _type: 'character', name: who});
    if (chat_cha.length > 0) {
        return chat_cha[0];
    } else {
        return null;
    }
}
const findTokenWithCharacter = function(id, who) {

    let arr = findObjs({ _type: 'graphic', name: 'vd_standing', represents: id, _pageid: vdGetCurrentPage(), bar1_value: who});
    if (arr.length > 0) {
        return arr[0];
    }
    return null;
}
const removeStanding = function(msg) {

    let character = findCharacterWithName(msg.who);
    let token = findTokenWithCharacter(character?character.get('_id'):'', msg.who);
    if (token) {
        token.remove();
        arrangeStandings(false);
    }
}
const arrangeStandings = function(addNew) {

	const currernt_page_id = vdGetCurrentPage();
    let tokens = findObjs({ _type: 'graphic', name: 'vd_standing', _pageid: currernt_page_id});
    if (tokens.length > 0 || addNew) {
        let bg_area = findObjs({ _type: 'graphic', name:'vd_area', _pageid:currernt_page_id});
        if (bg_area.length > 0) {
            bg_area = bg_area[0];
        } else {
            sendChat("error1","/w gm vd_area 토큰이 없습니다.",null,{noarchive:true});
            return;
        }
        let tokens_position = [];
        const compare = function( a, b ) {
            if ( a.left < b.left ){
              return -1;
            }
            if ( a.left > b.left ){
              return 1;
            }
            return 0;
          }
        for (var i=0;i<tokens.length;i++) {
            tokens_position.push({idx:i,left:tokens[i].get('left')});
        }
        tokens_position.sort(compare);
        let final_count = tokens.length + (addNew?1:0);
        final_count = final_count<2? 2: final_count;
        let space = Math.floor(bg_area.get('width')/final_count);
        let left = bg_area.get('left') - Math.floor(bg_area.get('width')/2);
        if (space < vd_setting.fit_width) {
            left += vd_setting.fit_width/2;
            space = Math.floor((bg_area.get('width')-vd_setting.fit_width)/(final_count-1));
        } else {
            left += space/2
        }
        let rand = addNew ? Math.floor(Math.random()*(tokens_position.length-1))+1 : Infinity;
        rand = rand < 0 ? 0 : rand;
        for (var i=0;i<tokens_position.length;i++) {
            let token = tokens[tokens_position[i].idx];
            token.set('left',left + space * (i + (i>=rand?1:0)));
        }
        return addNew ? left + space * (rand == Infinity ? 0 : rand) : false;
    }
}
// /define: global function
/* (visual_dialogue.js) 210312 코드 종료 */