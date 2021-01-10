/* 설치법: https://github.com/kibkibe/roll20_api_scripts/wiki/install-visual_dialogue.js */
/* (visual_dialogue.js) 210110 코드 시작 */
on('ready', function() {
    state.vd_settings = {
        name_font_size: 18,
        name_font_color: "rgb(255, 255, 255)",
        width: 900,
        height: 560,
        dialogue_font_size: 16,
        dialogue_font_color: "rgb(255, 255, 255)",
        desc_font_size: 20,
        desc_font_color: "rgb(200, 200, 200)",
        margin: 5,
        line_height: 1.7,
        letter_spacing: 0.85,
        max_number: 5,
        use_single_emotion: false, // 캐릭터들이 여러 감정표현을 사용할지(false) 대표 스탠딩 하나만 사용할지(true) 설정합니다.
                                  // true일 경우 'standings'라는 이름의 Rollable Table에서 스탠딩 이미지를 가져옵니다.
        show_extra_standing: true, // /as를 이용해 저널에 없는 캐릭터로 채팅할 경우 엑스트라 전용 스탠딩을 표시할지 (true) 스탠딩을 생략할지(false) 설정합니다.
                                   // true일 경우 extra_name에 설정한 이름에 따라 엑스트라용 스탠딩을 가져옵니다.
        extra_name: 'extra', // 엑스트라용 스탠딩 이미지를 검색하기 위해 사용할 키워드를 설정합니다.
        min_showtime: 1000, // 여러 채팅이 몰려서 순차적으로 표시할 경우 채팅당 최소 노출시간을 설정합니다. (1000=1초)
        showtime_ratio: 20 // 채팅 1글자당 표시 시간. 숫자가 커질수록 글자수 대비 대사의 표시시간이 길어집니다.
    };
    state.vd_stock = [];
});
on("destroy:graphic", function(obj) {
    if (obj.get('name') == "vd_standing") {
        arrangeStandings(false);
    }
});
on("chat:message", function(msg)
{
if ((msg.type == "general" || msg.type == "desc" || msg.type == "emote")
    && !msg.content.includes("<span style='color:#aaaaaa'>")
    && !msg.rolltemplate){
        
    if (msg.content.length > 0) {
        state.vd_stock.push(msg);
        if (state.vd_stock.length == 1) {
            showDialogue();
        }
    } 

} else if (msg.type == "api" && msg.content.indexOf("!@") === 0) {

    if (msg.content.indexOf("!@퇴장") == 0 || msg.content.indexOf("!@exit") == 0) {

        const keyword = msg.content.replace("!@퇴장","").replace("!@exit","");

        if (keyword.length == 0) {
            removeStanding(msg);
        } else if (playerIsGM(msg.playerid)) {
            if (keyword == ":전원" || keyword == ":전체" || keyword == ":all") {
                let tokens = findObjs({ _type: 'graphic', name: 'vd_standing', _pageid: Campaign().get("playerpageid")});
                tokens.forEach(token => {
                    token.remove();
                });
            } else if (keyword == ":엑스트라" || keyword == ":extra") {
                let tokens = findObjs({ _type: 'graphic', name: 'vd_standing', represents: '', _pageid: Campaign().get("playerpageid")});
                tokens.forEach(token => {
                    token.remove();
                });
            } else {
                msg.who = keyword.replace(":","");
                removeStanding(msg);
            }
        }

    } else {
        /* type이 API이고 감정표현 관련일 경우 */
        // 현재 표시중인 스탠딩 중 지금 감정표현을 입력한 캐릭터가 있는지 체크

        let chat_cha = findCharacterWithName(msg.who);
        let current_token = null;
        if (chat_cha || state.vd_settings.show_extra_standing) {
            current_token = findTokenWithCharacter(chat_cha?chat_cha.get('_id'):'', msg.who);
        }
        if (current_token) {
            // 현재 표시중일 경우 명령어 내의 감정이름 추출
            let emot = msg.content.replace('!@','');
            let nm = chat_cha?msg.who.replace(/ /g,'-'):state.vd_settings.extra_name;

            // 감정이름에 해당되는 rollable item 확인
            let rt = findObjs({ _type: 'rollabletable', name: state.vd_settings.use_single_emotion?'standings':nm});
            if (rt.length == 0) {
                if (state.vd_settings.use_single_emotion) {
                    sendChat("error","/w gm 이름이 **standings**인 rollable table이 없습니다.",null,{noarchive:true});
                } else {
                    sendChat("error","/w gm 이름이 **" + nm + "**인 rollable table이 없습니다.",null,{noarchive:true});
                }
                return;
            } else {
                let opt = { _type: 'tableitem', _rollabletableid: rt[0].get('_id')};
                if (state.vd_settings.use_single_emotion) {
                    opt.name = chat_cha ? msg.who : state.vd_settings.extra_name;
                } else if (emot.length > 0) {
                    opt.name = emot;
                }
                let rt_items = findObjs(opt);
                if (rt_items.length > 0) {

                    let opt = {
                        name: 'vd_standing',
                        _pageid: current_token.get('_pageid'),
                        width: state.vd_settings.width,
                        height: state.vd_settings.height,
                        bar1_value: msg.who,
                        left:current_token.get('left'),
                        top:current_token.get('top'),
                        layer: 'map',
                        imgsrc: rt_items[0].get('avatar').replace('med','thumb').replace('max','thumb'),
                        represents: chat_cha? chat_cha.get('_id'): '',
                        tint_color: current_token.get('tint_color')
                    };
                    createObj('graphic', opt);
                    current_token.remove();
                } else {
                    if (state.vd_settings.use_single_emotion) {
                        sendChat("error","/w gm **standings** rollable table에 이름이 **" + opt.name + "**인 item이 없습니다.",null,{noarchive:true});
                    } else {
                        sendChat("error","/w gm **" + rt[0].get('name') + "** rollable table에 이름이 **" + emot + "**인 item이 없습니다.",null,{noarchive:true});
                    }
                    return;
                }
            }
        }
    }    
}
});
const showDialogue = function() {

    let msg = state.vd_stock[0];

    let is_general = msg.type == "general";
    const font_color = state.vd_settings[is_general?'dialogue_font_color':'desc_font_color'];
    let font_size = state.vd_settings[is_general ? 'dialogue_font_size' : 'desc_font_size'];
    let bg_area = findObjs({ _type: 'graphic', name:'vd_area', _pageid:Campaign().get("playerpageid")});
    let bg_name = findObjs({ _type: 'graphic', name:'vd_name', _pageid:Campaign().get("playerpageid")});
    let bg_dialogue = findObjs({ _type: 'graphic', name:'vd_dialogue', _pageid:Campaign().get("playerpageid")});
    let bg_panel = findObjs({ _type: 'graphic', name:'vd_panel', _pageid:Campaign().get("playerpageid")});
    let split = [];
    
    // 필수 객체가 있는지 체크
    if (bg_area.length > 0) {
        bg_area = bg_area[0];
    } else {
        sendChat("error","/w gm 플레이어 페이지(" + getObj('page',Campaign().get("playerpageid")).get('name') + ")에 vd_area 토큰이 없습니다.",null,{noarchive:true});
        showNextDialogue();
        return;
    }
    if (bg_name.length > 0) {
        bg_name = bg_name[0];
    } else {
        sendChat("error","/w gm 플레이어 페이지(" + getObj('page',Campaign().get("playerpageid")).get('name') + ")에 vd_name 토큰이 없습니다.",null,{noarchive:true});
        showNextDialogue();
        return;
    }
    if (bg_dialogue.length > 0) {
        bg_dialogue = bg_dialogue[0];
    } else {
        sendChat("error","/w gm 플레이어 페이지(" + getObj('page',Campaign().get("playerpageid")).get('name') + ")에 vd_dialogue 토큰이 없습니다.",null,{noarchive:true});
        showNextDialogue();
        return;
    }
    if (bg_panel.length > 0) {
        bg_panel = bg_panel[0];
    } else {
        sendChat("error","/w gm 플레이어 페이지(" + getObj('page',Campaign().get("playerpageid")).get('name') + ")에 vd_panel 토큰이 없습니다.",null,{noarchive:true});
        showNextDialogue();
        return;
    }
    /* 대사 생성*/
    // 대사창이 있는지 확인하고 없으면 생성
    const width = bg_dialogue.get('width');
    const name_width = bg_name.get('width');
    let blank_name = '';
    let blank_dialogue = '';
    let text_name = getObj('text', bg_name.get('gmnotes'));
    let text_dialogue = getObj('text', bg_dialogue.get('gmnotes'));
    while (name_width > blank_name.length*state.vd_settings['name_font_size']*state.vd_settings['letter_spacing']) { blank_name += "ㅤ"; }
    while (width>blank_dialogue.length*font_size*state.vd_settings['letter_spacing']) { blank_dialogue += "ㅤ"; }

    if (text_name && text_name.get('_pageid') != Campaign().get("playerpageid")) {
        text_name.remove();
        text_name = null;
    }
    if ((text_dialogue && (text_dialogue.get('font_size') != font_size || text_dialogue.get('color') != font_color))
    || (text_dialogue && text_dialogue.get('_pageid') != Campaign().get("playerpageid"))) {
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
            font_size: state.vd_settings['name_font_size'],
            color: state.vd_settings['name_font_color']
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
    let name = (is_general? msg.who : '') + '\n' + blank_name;
    let str = msg.content;
    let filter_word = [
        {regex:/\*.+\*/g,replace:/\*/g}, // *, **, ***
        {regex:/``.+``/g,replace:/``/g}, // ``
        {regex:/\[.+\]\(.+\)/g,replace:/\[.+\]\(.+\)/g}, // []()
        {regex:/\$\[\[.+\]\]/g,replace:/\$\[\[.+\]\]/g}]; // [[]]
    for (var i=0;i<filter_word.length;i++) {
        let match = str.match(filter_word[i].regex);
        if (match) {
            for (var j=0;j<match.length;j++) {
                str = str.replace(match[j], match[j].replace(filter_word[i].replace,''));
            }
        }
    }

    if (str.length == 0){
        return;
    }

    // 대사 길이 분석 
    let desc_ratio = is_general ? 1 : 0.8;
    let amount = Math.ceil(width/font_size/state.vd_settings['letter_spacing']*3) -3;
    let idx = 0;
    let length = 0;
    const thirdchar = ['\'',' ',',','.','!',':',';','"'];
    const halfchar = ['[',']','(',')','*','^','-','~','<','>','+','l','i','1'];
    const arr = thirdchar.concat(halfchar);
    for (var i=0;i<str.length;i++){
        var c = str[i];
        for (var j=0;j<arr.length;j++) {
            if (c==arr[j]) {
                length -= (j<thirdchar.length ? 2 : 1);
                break;
            }
        }
        length += 3;
        if (length >= amount * desc_ratio) {
            let substr = str.substring(idx,i+1);
            split.push(is_general ? substr:getStringWithMargin(amount,length,desc_ratio,substr));
            idx = i+1;
            length = 0;
        }
    }
    if (idx < str.length) {
        let substr = str.substring(idx,str.length);
        split.push(is_general ? substr:getStringWithMargin(amount,length,desc_ratio,substr));
    } 

    // 길이별로 줄바꿈 추가 및 실제 표시할 string값 생성
    if (is_general) {
        while ((split.length+1) * font_size * state.vd_settings['line_height'] <
        bg_dialogue.get('height') + state.vd_settings['margin']*2) {
            split.push(' ');
        }
    } else {
        split.push(' ');
    }
    split.push(blank_dialogue);
    text_name.set({text:name,left:bg_name.get('left'),
    top:bg_name.get('top')+state.vd_settings['name_font_size']*state.vd_settings['line_height']/2});
    text_dialogue.set({text:split.join('\n')});

    if (msg.type != "desc") {
        // 대사를 한 캐릭터 판별
        let chat_cha = findCharacterWithName(msg.who);
        let current_token = null;
        if (chat_cha || state.vd_settings.show_extra_standing) {
            current_token = findTokenWithCharacter(chat_cha?chat_cha.get('_id'):'', msg.who);
        }

        // 현재 표시중인 스탠딩 객체 수집
        let tokens = findObjs({ _type: 'graphic', name: 'vd_standing', _pageid: Campaign().get("playerpageid")});
        let lowest_priority = tokens[0];
        // 현재 표시중인 모든 캐릭터 스탠딩을 dim 상태로 표시
        for (var i=0;i<tokens.length;i++) {
            var token = tokens[i];
            token.set('tint_color','#000000');
            if (parseInt(token.get('gmnotes')) < parseInt(lowest_priority.get('gmnotes'))) {
                lowest_priority = token;
            }
        }

        if (current_token == null && (chat_cha || state.vd_settings.show_extra_standing)) {
            // 현재 표시중이 아닐 경우 rollabletable을 통해 객체 생성 
            let nm = chat_cha?msg.who.replace(/ /g,'-'):state.vd_settings.extra_name;
            let rt = findObjs({ _type: 'rollabletable', name: state.vd_settings.use_single_emotion?'standings':nm});
            if (rt.length == 0) {
                if (state.vd_settings.use_single_emotion) {
                    sendChat("error","/w gm 이름이 **standings**인 rollable table이 없습니다.",null,{noarchive:true});
                } else {
                    sendChat("error","/w gm 이름이 **" + msg.who + "**인 rollable table이 없습니다.",null,{noarchive:true});
                }
                showNextDialogue();
                return;
            } else {
                let rt_opt = { _type: 'tableitem', _rollabletableid: rt[0].get('_id')};
                if (state.vd_settings.use_single_emotion) {
                    rt_opt.name = chat_cha ? msg.who : state.vd_settings.extra_name;
                } 
                let rt_items = findObjs(rt_opt);
                if (rt_items.length == 0) {
                    if (state.vd_settings.use_single_emotion) {
                        sendChat("error","/w gm **standings** rollable table에 이름이 **" + rt_opt.name + "**인 item이 없습니다.",null,{noarchive:true});
                    } else {
                        sendChat("error","/w gm **" + rt[0].get('name') + "** rollable table에 사용할 수 있는 스탠딩이 없습니다.",null,{noarchive:true});
                    }
                    showNextDialogue();
                    return;
                }
                let opt = {
                    name: 'vd_standing',
                    _pageid: bg_area.get('_pageid'),
                    width: state.vd_settings.width,
                    height: state.vd_settings.height,
                    bar1_value: msg.who,
                    layer: 'map',
                    imgsrc: rt_items[0].get('avatar').replace('med','thumb').replace('max','thumb'),
                    represents: chat_cha? chat_cha.get('_id'): ''
                };
        
                // 새로 생성된 객체를 포함한 스탠딩이 최대 표시개수를 초과했는지 체크
                if (tokens.length >= state.vd_settings.max_number) {
                    // 초과했을 경우 최근 대사가 가장 오래된 캐릭터의 스탠딩을 변형
                    opt.left = lowest_priority.get('left');
                } else {
                    // 초과하지 않았을 경우 알고리즘상으로 다음 순위의 위치에 생성
                    opt.left = arrangeStandings(true);
                }
                opt.top = bg_area.get('top');
                current_token = createObj('graphic', opt);
                if (tokens.length >= state.vd_settings.max_number) {
                    lowest_priority.remove();
                }
            }
        }
        if (current_token) {
            // 대사를 한 캐릭터의 스탠딩의 dim 상태 해제
            current_token.set({tint_color:'transparent',gmnotes:Date.now()});
            toFront(current_token);
        }
    }
    toBack(bg_panel);
    setTimeout(showNextDialogue, Math.max(state.vd_settings.min_showtime, str.length * state.vd_settings.showtime_ratio));
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
    // 시트가 있는 캐릭터인지 임시 AS인지 체크
    if (chat_cha.length > 0) {
        // 시트가 있는 캐릭터
        return chat_cha[0];
    } else {
        // 임시 AS 캐릭터
        return null;
    }
}
const findTokenWithCharacter = function(id, who) {

    // 스탠딩을 표시하는 대상일 경우 해당 캐릭터의 스탠딩이 현재 표시중인지 확인
    let arr = findObjs({ _type: 'graphic', name: 'vd_standing', represents: id, _pageid: Campaign().get("playerpageid"), bar1_value: who});
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

    let tokens = findObjs({ _type: 'graphic', name: 'vd_standing', _pageid: Campaign().get("playerpageid")});
    if (tokens.length > 0 || addNew) {
        let bg_area = findObjs({ _type: 'graphic', name:'vd_area', _pageid:Campaign().get("playerpageid")});
        // 필수 객체가 있는지 체크
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
        if (space < state.vd_settings.width) {
            left += state.vd_settings.width/2;
            space = Math.floor((bg_area.get('width')-state.vd_settings.width)/(final_count-1));
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
/* (visual_dialogue.js) 210110 코드 종료 */