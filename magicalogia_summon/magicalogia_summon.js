/* https://github.com/kibkibe/roll20-api-scripts/tree/master/magicalogia_summon */
/* (magicalogia_summon.js) 210626 코드 시작 */

// define: option
const ms_setting = {
	// option: TATECK님의 커스텀 시트를 사용하는지(true) 공개버전 시트를 사용하는지(false) 설정합니다.
	use_custom_sheet: false,
	// option: 원형을 소환할 페이지의 이름을 기입해주세요. 여러곳에서 사용할 경우 콤마(,)로 구분해서 입력합니다.
	// 페이지가 여럿일 경우 Player 북마크가 설정된 페이지에 우선적으로 소환됩니다.
	page_list: "spellbound",
	// option: 원형의 타입명을 표시할지 (true) 생략할지 (false) 설정합니다.
	display_type: true,
	// option: 원형의 특기를 표시할지 (true) 생략할지 (false) 설정합니다.
	display_skill: true,
	// option: 원형의 이펙트를 토큰 마커로 표시할지 (true) 표시하지 않을지 (false) 설정합니다.
	use_effect_marker: true,
	// option: use_effect_marker가 true일 때: 이펙트의 숫자를 마커 위에 텍스트로 표시할지(true) 숫자가 포함된 이미지를 불러올지(false) 설정합니다.
	// use_effect_marker가 false일 때: 원형토큰의 이름에 이펙트를 기재할지(true) 생략할지(false) 설정합니다.
	use_text: false,
	// option: 원형토큰의 이름에 이펙트를 기재하는 옵션일 경우, 이펙트 사이를 분리할 문자열을 설정합니다.	
	div_text: ",",
	// option: 사용할 이펙트 목록을 설정합니다.
	effect_list: [ 
		{marker:'block',display_name:'블',keyword:'block,bl,블록,블',use_bar:true},
		{marker:'damage',display_name:'추댐',keyword:'damage,da,추가대미지,대미지,추가데미지,데미지,추댐,추뎀,추'},
		{marker:'boost',display_name:'부',keyword:'boost,bo,부스트,부슽,부'},
		{marker:'cast',display_name:'캐',keyword:'cast,ca,캐스트,캐슽,캐',non_numbering:true},
		{marker:'mana',display_name:'마',keyword:'mana,ma,마나,마'},
		{marker:'word',display_name:'워',keyword:'word,wo,워드,워'},
		{marker:'minus',display_name:'-',keyword:'minus,mi,마이너스,-'},
		{marker:'plus',display_name:'+',keyword:'plus,pl,플러스,플,+'},
		{marker:'spellguard',display_name:'가',keyword:'spellguard,sp,스펠가드,가,가드,스'}],
	// option: 원형의 기본 습득 이펙트를 입력합니다. 룰북 내의 데이터이기 때문에 무료 배포하는 코드에 포함할 수 없으므로 해당 내용은 수기입해주시기 바랍니다. (ex: 'block1,damage1')
	archetype_list: [
		{name:'정령', effect:''},
		{name:'마검', effect:''},
		{name:'악몽', effect:''},
		{name:'기사', effect:''},
		{name:'처녀', effect:''},
		{name:'전차', effect:''},
		{name:'마왕', effect:''},
		{name:'군단', effect:''},
		{name:'왕국', effect:''},
		{name:'마신', effect:''},
		{name:'나락문', effect:''}
],
	// option: 원형이 소환되면 기본적으로 배치될 가로 위치를 지정합니다.
	opt_left: 1000,
	// option: 원형이 소환되면 기본적으로 배치될 세로 위치를 지정합니다.
	opt_top: 200,
	// option: 소환할 원형 토큰의 가로크기를 지정합니다.
	opt_width: 90,
	// option: 소환할 원형 토큰의 세로크기를 지정합니다.
	opt_height: 90,
	// option: 이름표 사용 여부(true/false)를 지정합니다.
	opt_showname: true,
	// option: Bar가 표시될 기본 위치를 지정합니다. (선택: 'top','overlap_top’,‘overlap_bottom’,'below')
	bar_location: ''
};
// /define: option

on("chat:message", function(msg)
{
if (msg.type == "api"){
	// on.chat:message:api
	if (msg.content.indexOf("!소환") == 0) { 
		try {
			let current_page;
			const page_list = ms_setting.page_list.replace(/, /g,',').replace(/ ,/g,',').split(',');
			if (page_list.indexOf(getObj('page',Campaign().get("playerpageid")).get('name')) > -1) {
				current_page = Campaign().get("playerpageid");
			} else {
				const page = findObjs({type:'page',name:page_list[0]});
				if (page.length > 0) {
					current_page = page[0].get('_id');
				} else {
					sendChat("error","/w gm 이름이 **" + page_list[0] + "**인 페이지가 없습니다.",null,{noarchive:true});
					return;
				}
			}

			let opt = {
				left: ms_setting.opt_left+Math.random()*70,
				top: ms_setting.opt_top+Math.random()*70,
				width: ms_setting.opt_width,
				height: ms_setting.opt_height,
				showname: ms_setting.opt_showname,
				showplayers_name: true,
				bar1_value: 0,
				controlledby:"all",
				pageid: current_page,
				statusmarkers: "",
				layer: "objects"
			};
			const default_tokens = ["red", "blue", "green", "brown", "purple", "pink", "yellow"];

			let section = msg.content.split(/\s*--/g);
			let skill, type;
			let split = "";
			let effects = [];
			if (section.length < 3) {
				type = section[1];
			} else {
				skill = section[1];
				type = section[2];				
				const archetype = ms_setting.archetype_list.find(archetype => archetype.name == type);
				if (!archetype) {
					return;
				} else {
					split += archetype.effect;
				}
				if (section.length > 3) {
					split += "," + section[3]
				}
			}
				
			opt.name = (skill && ms_setting.display_skill ? skill+ (type && ms_setting.display_type ? "의 ":"") : "") + (type && ms_setting.display_type ? type:'');
			const token_markers = JSON.parse(Campaign().get("token_markers"));
			if (ms_setting.bar_location == 'overlap_top' || ms_setting.bar_location == 'overlap_bottom' || ms_setting.bar_location == 'below') {
				opt.bar_location = ms_setting.bar_location;
			} else {
				opt.bar_location = null;
			}
			
			if (ms_setting.use_effect_marker || ms_setting.use_text) {
				split = split.split(/\s*,\s*/g);
				for (let index = 0; index < split.length; index++) {
					const element = split[index];
					const effect = element.replace(/\d/g,'');
					let number = element.replace(effect,'');
					for (let i = 0; i < ms_setting.effect_list.length; i++) {
						const fx = ms_setting.effect_list[i];
						if (effect == fx.marker || fx.keyword.split(",").indexOf(effect) > -1) {
							number = fx.non_numbering ? '' : number;
							let fx_obj = {display_name:fx.display_name,number:number};
							let duplicated_index = -1;
							for (let j = 0; j < effects.length; j++) {
								if (fx.display_name == effects[j].display_name) {
									duplicated_index = j;
									if (!fx.non_numbering) {
										number = (parseInt(effects[j].number) + parseInt(number.length>0?number:'0')) + "";
									}
									break;
								}
							}
							if (fx.use_bar && (number && number.length > 0)) {
								opt.bar1_value += parseInt(number);
								opt.bar1_max = opt.bar1_value;
								opt.showplayers_bar1 = true;
							} else if (fx.non_numbering || (number && number.length > 0)) {
								if (ms_setting.use_effect_marker) {
									let marker = token_markers.find(mark => mark.name == fx.marker+(ms_setting.use_text?'':number));
									if (!marker) {
										if (default_tokens.indexOf(fx.marker) > -1) {
											marker = {tag:fx.marker};
										} else {
											sendChat('error',"/w GM 사용할 수 있는 마커 중 이름이 **"+fx.marker+(ms_setting.use_text?'':number)+"**인 항목이 없습니다.",null,{noarchive:true});
											return;
										}
									}
									fx_obj.value = (ms_setting.use_text ?
										(marker.tag + (number.length>0?"@":'') + number) :
										marker.tag);
								} else if (ms_setting.use_text) {
									fx_obj.value = fx.display_name+number;
								}
								if (duplicated_index > -1) {
									effects.splice(duplicated_index,1,fx_obj);
								} else {
									effects.push(fx_obj);
								}
							}
						}
					}
				}
				if (ms_setting.use_effect_marker) {
					effects.forEach(element => {
						opt.statusmarkers += "," + element.value;
					});
					opt.statusmarkers = opt.statusmarkers.length > 0 ? opt.statusmarkers.substring(1) : '';
				} else if (ms_setting.use_text) {
					let str = "";
					for (let j = 0; j < effects.length; j++) {
						str += ms_setting.div_text + effects[j].value;
					}
					str = str.substring(1);
					opt.name = opt.name + (opt.name.length > 0 ? "/" : "") + str;
				}				
			}
			var archetype_deck = findObjs({ _type: 'deck', name: 'archetype'})[0];
			var archetype = findObjs({ _type: "card", _deckid: archetype_deck.get('_id'), name:type});
			if (archetype.length > 0) {
				opt.imgsrc = archetype[0].get('avatar').replace("med","thumb").replace("max","thumb");
				opt.gmnotes = (skill ? skill : '') + "," + type;
				createObj("graphic", opt);
			} else {
				sendChat('error',"/w GM 원형 타입 <"+type+">가 존재하지 않습니다.",null,{noarchive:true});
			}  
		} catch (err) {
			sendChat('error','/w GM '+err,null,{noarchive:true});
		}
	} else if (msg.content.indexOf("!저항 ") == 0 || msg.content.indexOf("!저항목표 ") == 0) {
        try {
            const table = [
                ['황금','대지','숲','길','바다','정적','비','폭풍','태양','천공','이계'],
                ['살','벌레','꽃','피','비늘','혼돈','이빨','외침','분노','날개','에로스'],
                ['중력','바람','흐름','물','파문','자유','충격','우레','불','빛','원환'],
                ['이야기','선율','눈물','이별','미소','마음','승리','사랑','정열','치유','시간'],
                ['추억','수수께끼','거짓','불안','잠','우연','환각','광기','기도','희망','미래'],
                ['심연','부패','배신','방황','나태','왜곡','불행','바보','악의','절망','죽음']
            ];
            if (msg.selected && msg.selected.length > 0) {
                for (let i = 0; i < msg.selected.length; i++) {
                    const tok = getObj("graphic", msg.selected[i]._id);
                    const gmnotes = unescape(tok.get('gmnotes')).replace(/(<([^>]+)>)/gi, "");
                    if (!gmnotes || gmnotes.length==0 || gmnotes.indexOf(',') < 0) {
                        sendChat('error','/w GM **' + tok.get('name')  + '**은 원형토큰이 아니거나 GM 노트에서 원형의 특기와 타입을 가져올 수 없습니다.',null,{noarchive:true});
                        return;
                    }
                    const split = gmnotes.split(',');
                    const name = split[0];
                    const type = split[1];
                    const target = msg.content.replace("!저항목표 ",'').replace("!저항 ",'');
                    if (type != "나락문") {
						if (!name || !target || name.length == 0 || target.length == 0) {
							sendChat('error','/w GM 원형의 특기를 가져올 수 없습니다.',null,{noarchive:true});
							return;
						}
						let target_x=-1;
						let target_y=-1;
						let arche_x=-1;
						let arche_y=-1;
						for (let i=0;i<table.length;i++) {
							for (let j=0;j<table[i].length;j++) {
								if (table[i][j] === target) {
									target_x = i;
									target_y = j;
								}
								if (table[i][j] === name) {
									arche_x = i;
									arche_y = j;
								}
							}
						}
						let res_target = 5 + Math.abs(target_x-arche_x)*2 + Math.abs(target_y-arche_y);
						if (target_x == -1 || target_y == -1 || arche_x == -1 || arche_y == -1) {
							res_target = 6;
						} else {
							if (target_x != arche_x) { res_target -= 1; }
							if (res_target > 12) { res_target = 12; }
						}
						if (msg.content.indexOf("!저항목표 ") > -1) {
							sendChat(name + "의 " + type, "**<" +target + ">**의 목표치: **" + res_target + "**");
						} else {
							if (ms_setting.use_custom_sheet) {
								sendChat(name + "의 " + type, "&{template:MagiDice} {{name=" + name + "의 " + type + "}} {{spec=" + target + "}}{{target=[[" + res_target + "]]}}{{roll1=[[1d6]]}}{{roll2=[[1d6]]}}");
							} else {
								sendChat(name + "의 " + type, "&{template:Magic} {{name=" + name + "의 " + type + "}} {{skillname=" + target + "}}{{target=[[" + res_target + "]]}}{{roll=[[1d6]],[[1d6]]}}");
							}
						}
					}
                }
            } else {
                sendChat('error','/w GM 선택된 원형 토큰이 없습니다.',null,{noarchive:true});
            }
            
        } catch (err) {
            sendChat('error','/w GM '+err,null,{noarchive:true});
        }
    }
	// /on.chat:message:api
}
});
/* (magicalogia_summon.js) 210626 코드 종료 */