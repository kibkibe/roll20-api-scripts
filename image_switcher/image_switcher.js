/* https://github.com/kibkibe/roll20-api-scripts/tree/master/image_switcher */
/* (image_switcher.js) 220118 코드 시작 */

// define: option
const is_setting = {
	// option: 스크립트와 연동할 카드덱/토큰의 키워드를 지정합니다. 이름이 이 글자로 시작하는 카드덱과 토큰만 스크립트의 사용대상이 됩니다. (띄어쓰기를 사용하지 마세요)
	keyword: "image",
	// option: 이미지 변경에 사용할 매크로의 이름을 지정합니다. (띄어쓰기를 사용하지 마세요)
	macro_name: "이미지변경"
};
// /define: option

on('ready', function() {
	// on.ready
    state.vd_stock = [];
	on("add:card", function(obj) {
		updateImageMacro(obj);
	});
	// /on.ready
});
on("destroy:deck", function(obj) {
	// on.destroy:card
	setTimeout(function() {
		updateImageMacro();
	},100);
	// /on.destroy:card
});
on("change:card", function(obj,prev) {
	// on.change:card
	updateImageMacro(obj);
	// /on.change:card
});
on("destroy:card", function(obj) {
	// on.destroy:card
	updateImageMacro(obj);
	// /on.destroy:card
});

on("chat:message", function(msg)
{
	if (msg.type == "api") {
		// on.chat:message:api
		if (playerIsGM(msg.playerid) && msg.content.startsWith("!#"+is_setting.keyword)) {

			const deck_name = msg.content.split(' ')[0].replace('!#','');
			let bg_background = findObjs({ _type: 'graphic', name:deck_name});
			let bg_deck = findObjs({ _type: 'deck', name:deck_name});
			if (bg_background.length == 0) {
				sendChat("error","/w gm 현재 페이지(**" + getObj('page',Campaign().get("playerpageid")).get('name') + "**)에 이름이 **" + deck_name +"**인 토큰이 없습니다.",null,{noarchive:true});
				return;
			} else if (bg_deck.length == 0) {
				sendChat("error","/w gm 이름이 **" + deck_name +"**인 덱이 캠페인에 없습니다.",null,{noarchive:true});
				return;
			} else if (msg.content.split(' ').length != 2) {
				sendChat("error","/w gm 명령어 형식이 올바르지 않습니다. (ex: *!#토큰이름 카드이름* or *!#토큰이름 이미지주소*)",null,{noarchive:true});
				return;
			}
			for (let i = 0; i < bg_background.length; i++) {
				const token = bg_background[i];
				const current_url = token.get('imgsrc');
				const new_bg = msg.content.replace('!#'+deck_name + ' ','');
				let is_url_input = (msg.content.indexOf('https://') > -1);
				if (is_url_input) {
					token.set('imgsrc',new_bg.replace('med','thumb').replace('max','thumb').replace(' ',''));
					if (current_url == token.get('imgsrc')) {
						sendChat("error","/w gm 배경 이미지가 정상적으로 변경되지 않았습니다. 주소나 명령어 형식이 올바른지 확인해주세요. (ex: !#토큰이름 이미지주소)",null,{noarchive:true});
					}
				} else {
					let bg_cards = findObjs({_type:'card', _deckid: bg_deck[0].get('_id'), name: new_bg});
					if (bg_cards.length == 0) {
						sendChat("error","/w gm 이름이 '**" + new_bg + "'**인 배경 카드가 **" + deck_name + "** 덱에 없습니다.",null,{noarchive:true});
						return;
					} else {
						token.set('imgsrc',bg_cards[0].get('avatar').replace('med','thumb').replace('max','thumb'));
					}
				}
			}
		}
		// /on.chat:message:api
	}
});
// define: global function
const updateImageMacro = function() {

	let background_deck = filterObjs(function(obj){
		return obj.get('_type') == 'deck' && obj.get('name').startsWith(is_setting.keyword);
	});
	if (background_deck.length > 0) {
		let action_str;
		let getCardStr = function(deck, is_sole) {
			const cards = findObjs({_type:'card',_deckid:deck.get('id')});
			let card_str = "";
			for (let j = 0; j < cards.length; j++) {
				const card = cards[j];
				card_str += (is_sole?"|":"\&\#124;") + card.get('name') + (is_sole?",!#":"\&\#44;!#") + deck.get('name') + " " + card.get('name');
			}
			return card_str;
		}
		if (background_deck.length > 1) {
			action_str = "?{변경할 토큰 이름을 선택하세요";
			for (let i = 0; i < background_deck.length; i++) {
				const deck = background_deck[i];
				action_str += "|" + deck.get('name') + ",?{변경할 이미지를 선택하세요";
				action_str += getCardStr(deck, false);
				action_str += "\&\#125;";
			}
		} else {
			action_str = "?{변경할 이미지를 선택하세요";
			action_str += getCardStr(background_deck[0], true);
		}
		action_str += "}";
		let players = findObjs({type:'player'});
		let gm_list = "";
		for (let index = 0; index < players.length; index++) {
			const player = players[index];
			if (playerIsGM(player.id)) {
				gm_list += player.id + ",";
			}
		}
		gm_list = gm_list.substring(0,gm_list.length - 1);
		let main_macro = findObjs({_type:'macro',name:is_setting.macro_name});
		let main_options = {name:is_setting.macro_name,action:action_str,visibleto:gm_list};
		if (main_macro.length > 0) {
			main_macro = main_macro[0];
			main_macro.set(main_options);
		} else {
			main_options.playerid = players[0].get('id');
			main_macro = createObj('macro',main_options);
		}
	}
}
// /define: global function
/* (image_switcher.js) 220118 코드 종료 */