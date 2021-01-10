/* 설치법: https://github.com/kibkibe/roll20_api_scripts/wiki/%5B%EC%84%A4%EC%B9%98%EB%B2%95%5D-magicalogia_summon.js */
/* (magicalogia_summon.js) 201101 코드 시작 */
on("chat:message", function(msg)
{
if (msg.type == "api"){
	if (msg.content.indexOf("!소환") === 0) { //명령어는 변경하셔도 됩니다. 시작은 무조건 느낌표.
		try {
			var str = msg.content.replace("   "," ").replace("  "," ");
			if (str.endsWith(" ")) {
				str = str.substring(0, str.length-1);
			}
			var section = str.split(" ");
			var skill, type, block;
			if (section.length < 3) {
				type = section[1];
			} else {
				skill = section[1];
				type = section[2];
				if (section.length > 3){
					block = section[3];
				}
			}
			//덱의 이름(name: 'archetype')은 변경하셔도 좋습니다. 사용할 세션방의 덱 이름과 일치시켜 주세요.
			var archetype_deck = findObjs({ _type: 'deck', name: 'archetype'})[0];
			var archetype = findObjs({ _type: "card", _deckid: archetype_deck.get('_id'), name:type});
			if (archetype.length > 0) {
				var characterImage = archetype[0].get('avatar');
				characterImage = characterImage.replace("med","thumb").replace("max","thumb");
				createObj("graphic", 
								{
									left: 1000+Math.random()*70, //원형이 소환되면 기본적으로 배치될 가로 위치
									top: 200+Math.random()*70, //원형이 소환되면 기본적으로 배치될 세로 위치
									width: 90, //소환할 원형 토큰의 가로크기
									height: 90, //소환할 원형 토큰의 세로크기
									name: skill? skill+" "+type : type,
									showname: true, //이름표 사용 여부 (true/false)
									showplayers_name: true, //플레이어에게 이름표를 보일지 여부 (true/false)
									showplayers_bar2: block?true:false,
									controlledby:"all",
									bar2_value: block?parseInt(block):null,
									bar2_max: block?parseInt(block):null,
									pageid: Campaign().get("playerpageid"),
									imgsrc: characterImage,
									layer: "objects"
								});
			} else {
				sendChat('error',"/w GM 원형 타입 <"+type+">가 존재하지 않습니다.",null,{noarchive:true});
			}  
		} catch (err) {
			sendChat('error','/w GM '+err,null,{noarchive:true});
		}
	}
}
});
/* (magicalogia_summon.js) 201101 코드 종료 */