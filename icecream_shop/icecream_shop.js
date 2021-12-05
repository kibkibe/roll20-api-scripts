const scrtp = ['/as GM 어서오십시오, 마법사님.<br>당신은 이경 안으로 들어서자마자 아이스크림 진열대와 마법사들로 북적북적한 풍경을 마주합니다.<br>[다음>>](!&#13;!nextIntro 1)',
'/as GM 주변을 살피는 당신에게 웬 양복입은 소나무 한그루가 다가와 말을 거는군요.<br>[다음>>](!&#13;!nextIntro 2)',
'"안녕하세요! 이번 임무의 담당 문호인 *<움직이지 않는 재보의 중개자>* 김강송입니다. 바쁘신 와중에 와주셔서 감사합니다."<br>[별말씀을요](!&#13;!nextIntro 4)[이 정신나간 분위기는 뭐지](!&#13;!nextIntro 3)',
'"아이고~ 좀 산만하죠? 이번 임무 장소가 어쩌다보니 독특한 곳이 되어놔서요."<br>[어쩌다 이런 곳에서?](!&#13;!nextIntro 4)',
'"음~ 지금 상황을 간단히 설명 드리자면 이렇습니다. 며칠 전에 천애에서 우리가 있는 이 세계선에 곧 특이점이 발생할 것이라는 관측을 했거든요."<br>[다음>>](!&#13;!nextIntro 5)',
'"뭐라던가? 세계법칙 일부의 시스템적 진화? 이런 비유를 하던데요?"<br>[과연, 이해했습니다](!&#13;!nextIntro 7)[뭔소린데 그게?](!&#13;!nextIntro 6)',
'"그러니까 그거죠, 누가 Roll20 마기로기 캐릭터시트에 업데이트를 하려고 한단 얘깁니다."<br>[음, 그렇군요](!&#13;!nextIntro 7)[메타발언 막 해도 돼?!?](!&#13;!nextIntro 7)',
'"아무튼 뭐어, 이것 자체는 좋은 일인데 문제는 그거죠. 무슨 문제가 생길지 모른다는 거예요."<br>[다음>>](!&#13;!nextIntro 8)',
'"이 특이점 때문에 앞으로 무슨 이변이 일어날지도 알 수 없거니와, 심지어 과거에 일어난 일들이 어떤 식으로 변형될지도 확실하지 않아요."<br>[그럼 큰일 아닌가요?](!&#13;!nextIntro 9)',
'"맞습니다! 그래서 이 사건의 담당 서공들이 며칠밤을 새워 방법을 구상해봤어요."<br>[어떤 방법이죠?](!&#13;!nextIntro 12)[서공 여러분께 애도를 표합니다...](!&#13;!nextIntro 10)',
'"괜찮아요~ 서공은 원래 이런 일 하라고 있는 경력이잖아요호호호호!"<br>[너무해!](!&#13;!nextIntro 11)[그래서 그 방법이 뭐죠?](!&#13;!nextIntro 11)',
'"아무튼, 서공 팀에서 낸 솔루션은 이렇습니다. **문제가 일어날 가능성을 지금 미리 끌어와서 일으킨다** 예요."<br>[미리 일으킨다고?](!&#13;!nextIntro 13)',
'"서공 팀에서 낸 솔루션은 이렇습니다. **문제가 일어날 가능성을 지금 미리 끌어와서 일으킨다** 예요."<br>[미리 일으킨다고?](!&#13;!nextIntro 13)',
'"언제 어떻게 튀어나올지 모르는 트러블을 비교적 안전한 곳에서 미리 발생시켜서, 일찌감치 대응을 해놓자! 그런 발상인거죠."<br>[호오](!&#13;!nextIntro 14)[그렇군요](!&#13;!nextIntro 14)',
'"그리하여, 이 아이디어를 기반으로, 트러블의 가능성 자체를 이렇게저렇게 잘 엮어서 어떻게든 하나의 금서로 만드는데 성공한 것이~ 바로!"<br>[바로?!](!&#13;!nextIntro 15)',
'"...음... 저 셀프 아이스크림 계산대입니다."<br>[그렇군요...?](!&#13;!nextIntro 16)[실화냐구](!&#13;!nextIntro 17)',
'"생각보다 침착하게 받아들이시는군요. 뭐 좋습니다."<br>[그러면 저걸 어떡하면 되는거죠?](!&#13;!nextIntro 18)',
'"뭐, 이해해주세요. 원래 마기로기란 룰이 좀 불합리하지 않습니까."<br>[불합리의 종류가 다른데요](!&#13;!nextIntro 19)[또 메타발언?!?](!&#13;!nextIntro 19)',
'"자, 이제 여기부터 마법사님의 도움이 필요해지는 지점이 나오는거죠."<br>[다음>>](!&#13;!nextIntro 20)',
'"자자, 진정하시고 어쨌든 여기부터 마법사님의 도움이 필요해지는 지점이 나오는거예요."<br>[뭐죠?](!&#13;!nextIntro 20)',
'"이 세계선의 \'마도서\'에 당신의 존재를 명명하고 **금서<무인아이스크림가게>**와 마법전을 펼쳐주세요."<br>[심플하네!](!&#13;!nextIntro 21)[역시 그렇게 되는군요](!&#13;!nextIntro 21)',
'"그리고 **금서한테서 아이스크림을 사다가** 서공들에게 갖다주세요."<br>[네?](!&#13;!nextIntro 22)[뭐라구요?](!&#13;!nextIntro 22)',
'"전투를 1회 마칠 때마다 특이점에 의한 왜곡이 구체화된 것을 아이스크림의 형태로 얻을 수 있거든요. 그걸 분석하면 서공들이 특이점에 의한 논리적 오류를 조정할 수 있을겁니다."<br>[음, 이해했습니다](!&#13;!nextIntro 23)[?그렇군?요?](!&#13;!nextIntro 24)',
'"정말 상황을 잘 받아들이시는군요. 이전에 겪은 역경이 많으신가봅니다. 아무튼 무사히 금서를 봉인하고 모든 이변을 잡아내면 우리 마법사들의 승리가 되는거예요!"<br>[좋습니다](!&#13;!nextIntro 25)',
'"아무튼 무사히 금서를 봉인하고 모든 이변을 잡아내면 우리 마법사들의 승리가 되는거예요!"<br>[뭔가 이상하지만 아무튼 좋습니다](!&#13;!nextIntro 25)',
'"에... 그런데 이 금서가 좀... 특이한 점이 있어서요, 몇가지 미리 알아두실 게 있어요."<br>[뭐죠?](!&#13;!nextIntro 26)[지금까지도 충분히 특이했지만 뭐죠?](!&#13;!nextIntro 26)',
'"보시다시피 금서가... 무인 판매대의 모습이지 않습니까. 이 금서와 마법전을 진행하려면 전부 **셀프**로 하셔야 합니다."<br>[셀프요?](!&#13;!nextIntro 27)',
'"마법전을 진행하는 보이지 않는 인과력... 대놓고 말하자면 GM이 없으니 대미지 계산이나 금서 마력 조정도 다 플레이어가 직접 해야 한다는 얘기예요~"<br>[그렇군요](!&#13;!nextIntro 28)[메타발언!메타발언!!](!&#13;!nextIntro 28)',
'"아무튼! 마법사님이 금서와 상호작용하기 위해서 우선은 이 세계선의 \'마도서\'에 당신의 존재를 명명해야 해요."<br>[어떻게요?](!&#13;!nextIntro 29)',
'"음... 주문을 외쳐보실래요? **!저에게 새 캐릭터를 내려주세요!** 라고요. 앞뒤로 느낌표 붙이는 것도 잊지 마세요~"',
'"좋아요! 저널에 플레이어와 똑같은 이름의 캐릭터가 생성됐죠?"<br>[사람 많은데서 부끄러워...](!&#13;!nextIntro 31)[이제 메타발언은 신경도 안쓰는군요](!&#13;!nextIntro 31)',
'"한명의 마법사가 가능성을 끌어오는데는 1시간의 간격이 필요해요. 게임에 더 자주 참여하고 싶다면 아까 그 주문을 외쳐서 전투에 참가할 또다른 마법사를 명명해주세요."<br>[가뿐하군요](!&#13;!nextIntro 32)[복잡하지만 알겠어요](!&#13;!nextIntro 32)',
'"그리고 마법사님이 직접 마법전을 진행하는데 필요한 마법이 **\'매크로\'**에 있을겁니다. 지금 열어서 확인해보고 모두 **\'표시\'**를 눌러주세요. 그리고 매크로 바 자체를 표시하는 옵션도 눌러주세요.',
'"오호호~ 좋아요. 잘 하셨어요. 이제 제가 더 가르칠 것은 없으니 하산하십시오."<br>[감사합니다 스승님](!&#13;!nextIntro 34)[드립 칠 때가 아니지요??](!&#13;!nextIntro 35)',
'"그런 반응도 이해합니다. 마기로기에서 스승이 엮인 일은 대체로 좋은 경우가 없는 편이죠."<br>[그런 문제냐구](!&#13;!nextIntro 35)',
'"어쨌든 이 **\'매크로\'**들은 당신이 그때그때 사용할 수 있는 것만 보일거예요. 이걸 어떻게 사용하면 되는지는 **\'저널\'**에 사용법이 있으니 꼭 열어서 읽어보세요."<br>[다음>>](!&#13;!nextIntro 36)',
'"그리고 \'저널\'에 미약하게나마 서공 팀과 논리적으로 연결된 메모란도 있으니 물어보고 싶은걸 적어놓으면 시간차는 조금 있더라도 답변을 남길 수 있을거예요."<br>[어디요?](!&#13;!nextIntro 37)',
'(김강송씨가 가리킨 곳에는 가게에 없는 아이스크림을 추가해달라고 요청할 때 쓰는 화이트보드가 걸려 있다...)<br>[진짜냐고...](!&#13;!nextIntro 38)[실화냐고...](!&#13;!nextIntro 38)',
'"아이고~ 그럼 잘 부탁드립니다! 그럼 저는 다른 분께도 설명을 드리러 이만!"<br>[수고하세요](!&#13;!nextIntro 39)[진짜?이대로 시작하는거야?](!&#13;!nextIntro 39)',
'(그 말을 마지막으로 김강송씨는 부지런히 가지를 휘적거리며 호다닥 달려갑니다)<br>[다음>>](!&#13;!nextIntro 40)',
'/as GM ***<인트로 종료!>***'];

const outro_scrtp = ['/as GM 그리고 중첩된 가능성의 시공에 갇혀있던 당신의 주변으로 탁 트인 공간이 펼쳐집니다.<br>[다음>>](!&#13;!nextOutro 1)',
'/as GM 금서의 주권이 사라진 자리에서, 당신은 흐릿하게 사람의 형태가 비치는 것을 발견합니다.<br>[다음>>](!&#13;!nextOutro 2)',
'/as ???? "아- 이제야 저주에서 풀려났구나."<br>[누구지?](!&#13;!nextOutro 3)',
'"고맙소, 마법사여."<br>[당신은?](!&#13;!nextOutro 4)[아니, 님 누구신데요](!&#13;!nextOutro 4)',
'"나는 본디 군사를 이끄는 장수로서 이 땅을 지키다가 전장에서 스러진 자, 그 후 토지신으로서 천년의 세월동안 줄곧 이곳을 보살펴왔소."<br>[그랬군요?](!&#13;!nextOutro 5)["무인"이 그 무인이였어??](!&#13;!nextOutro 5)',
'"세계의 왜곡에 의해 잠시 수호자로서의 본모습을 잃었으나 그대들로 인해 스스로를 되찾았으니 이 감사를 이루 말로 다 할 수 없구려."<br>[다행입니다](!&#13;!nextOutro 6)[아니 이게 다 뭔소리야](!&#13;!nextOutro 6)',
'"이제 토지신의 이름을 걸고 이 땅을 다시 안전하게 보전할 것이니 그대들은 염려를 덜기 바라오."<br>[알겠습니다](!&#13;!nextOutro 7)[아 대체 뭔데요](!&#13;!nextOutro 7)',
'"부디 그대들의 앞날에 축복이 있기를."<br>[감사합니다](!&#13;!nextOutro 8)[아니 진짜 뭐냐고](!&#13;!nextOutro 8)',
'/as GM 그 목소리와 함께 무인은 사라지고 이경화되었던 공간은 현실로 되돌아갑니다.<br>[다음>>](!&#13;!nextOutro 9)',
'/as GM 자, 수고하셨습니다. 이제 당신의 세계로 복귀할 시간입니다.<br>[다음>>](!&#13;!nextOutro 10)',
'/as GM 여러분이 합심해서 특이점과 싸운 덕분에 고쳐야 할 버그가 잔뜩 발견됐지만~ 그건 서공들이 알아서 할 일이죠.<br>[다음>>](!&#13;!nextOutro 11)',
'/as GM 참고로 공적점 계산도 셀프니까 잊지말고 챙겨가세요.<br>[다음>>](!&#13;!nextOutro 12)',
'/as GM **<이용해주셔서 감사합니다~ 바구니는 제자리에 갖다놔주세요~>**<br>[다음>>](!&#13;!nextOutro 13)',
'/as " " ***-END-***'];

const interval = 5000;
const vein_name = " 금서<무인아이스크림가게>";
const tree = "김강송";
const soldier = "대장군<안이수>";

function macroID(name) {
	return state.macroIDList[name];
}

on('ready', function() {

	if (!state.currentQueue) {
		state.currentQueue = [];
		state.currentRound = 0;
		state.currentStep = 0;
		state.lastCheckTime = 0;
	}
	if (!state.lastPlayTime) {
		state.lastPlayTime = {};
	}
	if (!state.introRecord) {
		state.introRecord = {};
	}
	if (!state.outroRecord) {
		state.outroRecord = {};
	}
	if (!state.battleRecord) {
		state.battleRecord = {};
	}

	on("add:character", function(obj){
		if (obj.get('name') != tree && obj.get('name') != soldier) {
			if (obj.get('inplayerjournals') != 'all') {
				obj.set({inplayerjournals: 'all'});
			}
		}
	});

	//state.currentQueue = [];
	//state.lastPlayTime = {};
	//state.battleRecord = {};
	//state.introRecord = {};
	//state.battleFinished = false;
	
	//removeCharacterWithName('양천일염');
	//removeCharacterWithName('얭첀일옘');
	//const itms = findObjs({type:'macro'});
	//for (let i=0;i<itms.length;i++) {
	//     itms[i].set({visibleto:'all'});
	//}
});

on("add:player", function(obj){

	forceAddMacro(obj);
});

on("change:player:_online", function(obj) {
	try {
		if (obj.get('_online')){
			if (!isIntroPlayedPlayer(obj.get('id'))) {
				setTimeout(function() {
					sendChat('🤖','새로운 손님 **' + obj.get('_displayname') + '**님이 참여하셨습니다! 잡담을 하시려면 ***"! 잡담"***이라고 채팅해주세요.');
					sendWhisperMsg(obj.get('_displayname'), scrtp[0], false);
				},5000);
			}
		} else {
			setQueueText();
		}
	} catch (err) {
		sendErr(err);
	}
});

function forceAddMacro(obj) {
	try {
		if (!state.introRecord[obj.id] && !playerIsGM(obj.id)) {
			obj.set({showmacrobar:true});
		}
	} catch (err) {
		sendErr(err);
	}
}

on("change:player:showmacrobar", function(obj, prev) {
    checkMacro(obj);
});
on("change:player:_macrobar", function(obj, prev) {
    checkMacro(obj);
});

on("chat:message", function(msg)
{
	try {
	if (msg.type == "api"){
		let d = new Date();
		const player = getObj('player',msg.playerid);
		let character;
		if (player) {
			character = getObj('character',player.get('speakingas').replace('character|',''));
		}

		if (msg.content == "!아이스크림") {
			sendChat("🤖", (character ? character.get('name') : player.get('_displayname')) + "님, " + randomIcecream() + " 뽑았네요.");
		} else if (msg.content.startsWith("!저에게") && msg.content.indexOf("새") > -1 && msg.content.indexOf("캐릭터") > -1 && msg.content.indexOf("주세요!") > -1) {
			const player_name = player.get('_displayname');
			if (findObjs({type:'character',name:player_name}).length < 1) {
				createObj('character',{
					name: player_name,
					inplayerjournals: 'all',
					controlledby: msg.playerid});
				sendChat('🤖','/w "' + player_name + '" ' + player_name + ' 고객님~ 넹, 드렸습니다.',null,{noarchive:true});
				if (state.introRecord[msg.playerid] == 29) {
					sendWhisperMsg(player_name, scrtp[30], false);
				}
			} else {
				sendChat('🤖','/w "' + player_name + '" 있는 캐릭터 슬롯부터 먼저 써주세요~',null,{noarchive:true});
			}
		} else if (msg.content == "!밑장빼기") {
			state.currentQueue.splice(0,1);
			setQueueText();
		} else if (msg.content.startsWith("!저기요?")) {
			if (!state.battleFinished) {
				sendWhisperMsg(player.get('_displayname'), scrtp[parseInt(state.introRecord[msg.playerid])], false);
			} else {
				sendWhisperMsg(player.get('_displayname'), scrtp[parseInt(state.outroRecord[msg.playerid])], true);
			}
		} else if (msg.content.startsWith("!nextIntro")) {
			const index = msg.content.split(' ')[1];
			
			if (state.introRecord[msg.playerid] < index || !state.introRecord[msg.playerid]) {
				state.introRecord[msg.playerid] = parseInt(index);
				sendWhisperMsg(player.get('_displayname'), scrtp[parseInt(index)], false);
				if (index == 33) {
					state.introRecord[msg.playerid] = false;
					forceAddMacro(player);
					state.introRecord[msg.playerid] = 33;
					checkMacro(player);
				}
			}
		} else if (msg.content.startsWith("!nextOutro")) {
			if (state.battleFinished == true) {
				const index = msg.content.split(' ')[1];
				state.outroRecord[msg.playerid] = parseInt(index);
				sendWhisperMsg(player.get('_displayname'), outro_scrtp[parseInt(index)], true);
				if (index == 3) {
					let page = Campaign().get('playerspecificpages');
					if (!page) {
						page = {};
					}
					page[msg.playerid] = findObjectWithName('page','outro2').get('_id');
					Campaign().set('playerspecificpages',false);
					Campaign().set('playerspecificpages',page);
				} else if (index == 8) {
					let page = Campaign().get('playerspecificpages');
					if (!page) {
						page = {};
					}
					page[msg.playerid] = findObjectWithName('page','outro3').get('_id');
					Campaign().set('playerspecificpages',false);
					Campaign().set('playerspecificpages',page);
				}
			}
		} else if (msg.content == "!log" && msg.selected) {
			log(msg.selected);
		} else if (msg.content == "!log" && !msg.selected) {
			log(state.currentQueue);
		} else if (msg.content.startsWith('!insert ')) {
			state.currentQueue.splice(0,0,findIDWithName(msg.content.replace('!insert ','')));
			log(state.currentQueue);
			setQueueText();
		} else if (msg.content == "!test") {
			setQueueText();
		} else if (msg.content.startsWith("!playIntro ")) {
			let name = msg.content.replace('!playIntro ','');
			let fpl = findObjs({type:'player',displayname:name});
			fpl = fpl[0];
			state.introRecord[fpl.get('_id')] = 0;
			sendWhisperMsg(name, scrtp[0], false);
		} else if (msg.content.startsWith("!force")) {

			let name = msg.content.replace('!force ','');
			let fpl = findObjs({type:'player',displayname:name});
			fpl = fpl[0];
			state.introRecord[fpl.get('_id')] = false;
			forceAddMacro(fpl);
		} else if (msg.content == "!마법전참여") { //마법전 참여
			// 대기열에 참여
			if (requestCharacter(character, player.get('_displayname'))) {
				if (d - (new Date(state.lastPlayTime[character.get('_id')])) < 3600000) {
					let nextTime = new Date(state.lastPlayTime[character.get('_id')]);
					let tz = nextTime.getTime() + (nextTime.getTimezoneOffset() * 60000) + (10 * 3600000);
					nextTime.setTime(tz);
		
					sendChat('🤖','/w "' +  player.get('_displayname') + '" ' + character.get('name') + '님, 다른 시간대의 가능성을 끌어오는데 1시간의 간격이 필요합니다. 당신의 다음 가능성은 '
					+ nextTime.getHours() + ':' + nextTime.getMinutes() + '에 활성화됩니다.' ,null,{noarchive:true});
				} else {
					if (state.currentQueue.indexOf(character.get('id')) == -1) {
						state.currentQueue.push(character.get('id'));
						setQueueText();
						sendChat('🤖','/w "' + player.get('_displayname') + '" ' + character.get('name') + '님, 계산대 줄에 섰습니다. (현재 대기인원:' + (state.currentQueue.length - 1) + '명)',null,{noarchive:true});
					} else {
						sendChat('🤖','/w "' + player.get('_displayname') + '" ' + character.get('name') + '님, 당신은 이미 줄을 서고 있습니다.',null,{noarchive:true});
					}
				}
			}
		} else if (msg.content == "!신청취소") { //신청취소
			if (requestCharacter(character, player.get('_displayname')) && state.currentQueue.indexOf(character.get('id')) > -1) {
				state.currentQueue.splice(state.currentQueue.indexOf(character.get('id')),1);
				callNextMagician(false);
				sendChat('🤖','/w "' + player.get('_displayname') + '" ' + character.get('name') + '님, 참가를 취소하고 계산을 기다리는 줄에서 나왔습니다.',null,{noarchive:true});
			}
		} else if (msg.content == "!마법전신청") { //마법전신청
			// 메시지 전송자의 id가 대기열 맨 앞이거나 맨 앞의 플레이어가 대기열 변경시간으로부터 5분 이상 경과되었을 때 수락
			if (requestCharacter(character, player.get('_displayname'))) {
				if (state.currentQueue.length > 0) {
					setQueueText();
					if (state.currentQueue[0] == character.get('id')) {
						state.currentRound = -1;
						state.currentStep = 0;
						sendChat("","/desc " + msg.who + "의 계산... 아니 마법전이 시작됩니다.");
						sendChat("","/desc 마법전 신청대사 후 주권을 전개해주세요.");
						state.currentCharacter = character.get('id');
					} else if (state.currentQueue.length > 1 && state.currentQueue[1] == character.get('id') && d - (new Date(state.lastCheckTime)) > 300000) {
						const cha = getObj('character', state.currentQueue[0]);
						let name = "차례가 돌아온 마법사";
						if (cha) {
							name = cha.get('name');
						}
						sendChat("🤖", name + "님이 오랫동안 마법전을 신청하지 않아 다음 손님으로 넘어갑니다.");
						callNextMagician(true);
						state.lastCheckTime = d;
					} else if (state.currentQueue.indexOf(character.get('id')) > -1) {
						sendChat('🤖','/w "' + player.get('_displayname') + '" ' + msg.who + '님, 아직 순서가 아닙니다. 앞 손님을 잠시만 기다려주세요.',null,{noarchive:true});
					} else {
						sendChat('🤖','/w "' + player.get('_displayname') + '" ' + msg.who + '님, 아직 마법전 참여를 하지 않으셨습니다.',null,{noarchive:true});
					}
				} else {
					sendChat('🤖','/w "' + player.get('_displayname') + '" ' + msg.who + '님, 아직 마법전 참여를 하지 않으셨습니다.',null,{noarchive:true});
				}
			}
		} else if (msg.content == "!다음단계진행>") { //다음으로 진행
			if (requestCharacter(character, player.get('_displayname'))) {
				if (state.currentCharacter == character.get('id')) {
					if (state.currentRound == -1) {
						state.currentRound = 0;
						sendChat("","/desc 마법전 개시");
						if (!state.battleRecord[character.get('_id')]) {
							state.battleRecord[character.get('_id')] = 1;
							sendChat("🤖","어서오세요~ 처음 방문하신 고객께서는 마력결정을 먼저 해주시고 모든 장서의 마소를 근원력의 -1점까지 충전해주세요.");
						} else {
							sendChat("🤖","어서오세요~ 드라마씬을 대신해서 마법전을 시작하는 지금 타이밍에 에이드를 진행하실 수 있습니다.");
						}
						state.currentStep = 0;
						state.lastCheckTime = d;
					} else {state.currentStep++;
						state.lastCheckTime = d;
						if (state.currentStep == 1 || state.currentStep > 5) {
							if (checkDiceMatched(character)) {
								state.currentRound++;
								state.currentStep = 1;
								sendChat('','!clear_dice remain_gm_dice');
								if (state.currentRound < 3) {
									sendChat("","/desc Round"+(state.currentRound)+"");
									sendChat("🤖","마소충전 및 라운드 도입 처리를 해주세요. (마소농밀로 2점)");
								} else {
									sendChat("","/desc 마법전 종료");
									sendChat("","!원형삭제");
									sendChat("🤖", character.get('name') + " 고객님의 이번 가능성에서의 전투가 종료되었습니다.");
									const icecream = randomIcecream();
									sendChat(findIDWithName(vein_name),'*"감사합니다. 바구니는 제자리에 놔주세요~"*');
									sendChat("🤖", character.get('name') + "님은 " + icecream + " 사서 밖으로 나왔습니다.");
									const prev = state.lastPlayTime[character.get('_id')];
									if (prev == undefined) {
										state.lastPlayTime[character.get('_id')] = {};
									}
									const icecreams = findObjectWithName('handout','역대 아이스크림 수집목록');
									icecreams.get('notes',function(text) {
										let new_list = text + "<p>" + icecream.substring(0,icecream.length-1) + " (by " + character.get('name') + ")" + "</p>";
										setTimeout(function(){
											icecreams.set({notes: new_list});
										},100);
									});
									state.lastPlayTime[character.get('_id')] = d;
									callNextMagician(true);
								}
							}
						} else if (state.currentStep == 2) {
							sendChat("","/desc Round"+(state.currentRound)+".선공소환");
							sendChat(findIDWithName(vein_name),'"*바코드를 찍어주세요.*"');
							sendChat("🤖","플레이어는 소환단계를 진행해주세요.");
						} else if (state.currentStep == 3) {
							sendChat("","/desc Round"+(state.currentRound)+".후공소환");
							const rand = Math.floor(Math.random() * 2);
							if (rand < 1) {
								sendChat("🤖","금서는 **비평**을 사용합니다. 목표는 "+character.get('name')+".");
								sendChat(findIDWithName(vein_name),"%{ 금서<무인아이스크림가게>|magic1}");
							} else {
								sendChat("🤖","금서는 **주문**을 사용합니다. 목표는 "+character.get('name')+".");
								sendChat(findIDWithName(vein_name),"%{ 금서<무인아이스크림가게>|magic2}");
							}			
						} else if (state.currentStep == 4) {
							sendChat("","/desc Round"+(state.currentRound)+".선공공격");
							sendChat(findIDWithName(vein_name),'"*IC 리더기에 카드를 삽입해주세요.*"');
							sendChat("🤖","플롯 영역에 공격주사위를 세팅한 뒤 판정 매크로를 사용해주세요.");
							state.battleRecord[character.get('_id')] = 2;
						} else if (state.currentStep == 5) {
							if (checkDiceMatched(character)) {
								sendChat("","/desc Round"+(state.currentRound)+".후공공격");
								sendChat("🤖","플롯 영역에 방어주사위를 세팅한 뒤 판정 매크로를 사용해주세요.");
								sendChat('','!clear_dice remain_gm_dice');
								state.battleRecord[character.get('_id')] = 2;
							}
						}
					}
					
				} else if (state.currentQueue.indexOf(character.get('id')) > -1) {
					sendChat('🤖','/w "' + player.get('_displayname') + '" ' + msg.who + '님, 아직 순서가 아닙니다. 앞 손님을 잠시만 기다려주세요.',null,{noarchive:true});
				} else {
					sendChat('🤖','/w "' + player.get('_displayname') + '" ' + msg.who + '님, 아직 마법전 참여를 하지 않으셨습니다.',null,{noarchive:true});
				}
			}
		} else if (msg.content == "!공방주사위-판정") { //공방주사위 판정
			if (requestCharacter(character, player.get('_displayname'))) {
				if (state.currentCharacter == character.get('id')) {
					sendChat("","!match_dice flip");
					state.battleRecord[character.get('_id')] = 1;
					state.lastCheckTime = d;
				} else if (state.currentQueue.indexOf(character.get('id')) > -1) {
					sendChat('🤖','/w "' + player.get('_displayname') + '" ' + msg.who + '님, 아직 순서가 아닙니다. 앞 손님을 잠시만 기다려주세요.',null,{noarchive:true});
				} else {
					sendChat('🤖','/w "' + player.get('_displayname') + '" ' + msg.who + '님, 아직 마법전 참여를 하지 않으셨습니다.',null,{noarchive:true});
				}
			}
		} else if (msg.content == "!마지막일격") { //마지막 일격
		
			if (state.battleFinished == true && state.outroRecord[msg.playerid] == undefined) {
				let name = "마법사";
				if (character) {
					name = character.get('name');
				} 
				state.outroRecord[msg.playerid] = -1;
				sendChat("GM",'/w "' + player.get('_displayname') + '" ' + name + '의 마지막 타격에 이윽고 **<무인아이스크림가게>**가 망함... 아니, 힘을 잃고 서서히 붕괴합니다.<br>[다음>>](!&#13;!nextOutro 0)');

			}
		}
	}
	} catch (err) {
		sendErr(err);
	}
});

function requestCharacter(cha, pl_name) {
	try {
		if (!cha) {
			sendChat('🤖','/w "' + pl_name + '" 현재 As가 캐릭터가 아닙니다. 캐릭터를 생성한 뒤 캐릭터의 As로 마법전에 참여해주세요.',null,{noarchive:true});
			return false;
		} else {
			return true;
		}
	} catch (err) {
		sendErr(err);
	}
}

function checkDiceMatched(character) {

	try {
		if (state.battleRecord[character.get('_id')] == 2) {
			state.currentStep--;
			sendChat("🤖",'/w "' + character.get('name') + '" 고객님! 아직 공방주사위 판정 안하셨어요~');
			return false;
		}
		return true;
	} catch (err) {
		sendErr(err);
	}
}

on("change:attribute:current", function(obj, prev) {
	try {
		const sender = getObj('character',obj.get('_characterid'));
		if (sender.get('name') == vein_name && obj.get('name') == 'mp') {
			let cha = getObj('character',state.currentCharacter);
			if (Math.abs(prev.current - obj.get('current')) > 30) {
				sendChat("🤖",'정상적이지 않은 범위의 대미지가 감지되어 마력 수치를 돌려놓습니다. 규칙에 따라 플레이 해주세요.');
				setTimeout(() => {
					obj.set('current', prev.current);
				}, 1000);
			} else if (obj.get('current') < 1) {

				const currentMusic = findObjs({type:'jukeboxtrack', playing:true})[0];
				const endingMusic = findObjs({type:'jukeboxtrack', title:'\bending'})[0];
				if (currentMusic) {
					currentMusic.set({playing:false});
				}
				endingMusic.set({playing:true});

				let page = findObjectWithName('page','outro1');
				Campaign().set('playerpageid',page.get('_id'));

				let name;
				if (!cha) {
					name = "마법사";
				} else {
					name = cha.get('name');
				}
				sendChat("GM", name + "의 공격에 금서의 마력이 서서히 무너져내립니다.");
				setTimeout(() => {
					sendChat("GM","그러자 이곳에 잠시 모여있던 수많은 차원의 가능성들이 원래의 좌표를 찾아 갈라져 나가기 시작합니다.");
				}, 5000);
				setTimeout(() => {
					sendChat("GM","분열된 가능성이 마법사들에게 돌아가자, 모두의 눈앞에 각기 다른 금서의 최후가 펼쳐집니다.");
				}, 10000);
				setTimeout(() => {
					sendChat("GM","모든 마법사 여러분은 자신이 어떻게 금서를 마무리했는지 묘사해주시고 **마지막 일격**을 가해주세요.");
				}, 15000);
				setTimeout(() => {
					sendChat("","/desc <막타묘사 -전원>");

				}, 20000);

				setQueueText("<마법전 종료! 참여한 마법사 전원은 금서에게 마지막 일격을 가해주세요>");
				state.battleFinished = true;
		
				const macros = findObjs({type:'macro'});
				for (let i=0;i<macros.length;i++) {
					const macro = macros[i];
					if (macro.get('name') == "마지막일격") {
						macro.set('visibleto', 'all');
					} else {
						macro.set('visibleto', "");
					}
				}
			}
		}
	} catch (err) {
		sendErr(err);
	}
});

function findIDWithName(name) {
	try {
		let cha = findObjectWithName('character',name);
		if (cha) {
			return 'character|'+findObjectWithName('character',name).get('_id');
		} else {
			return 'character|'+findObjectWithName('character',name).get('_id');
		}
	} catch (err) {
		sendErr(err);
	}
}

function findObjectWithName(type, name) {
	try {
		let objs = findObjs({type: type, name: name});
		return objs[0];
	} catch (err) {
		sendErr(err);
	}
}

function checkMacro(obj){
	try {
		if (state.introRecord[obj.get('_id')] == 32 && obj.get('showmacrobar') && obj.get('_macrobar').split(',').length > 7) {
			sendWhisperMsg(obj.get('_displayname'), scrtp[33], false);
		}
	} catch (err) {
		sendErr(err);
	}
}

const condition_array = ["반쯤 녹은","녹았다가 이상한 모양으로 다시 언","성에가 잔뜩 낀","의외로 상태가 괜찮은","냉동고 구석에 구겨져있던","봉투가 조금 찢어진","제조일자가 50년 전인",
"제조일자가 10년 뒤인","봉투에서 완전히 분리된"];
const flavour_array = ["두리안맛","오모리 김치찌개맛","파리바게트 콜라보 식빵맛","샤인머스캣맛","에너지드링크맛","가시오가피맛","차돌된장맛","나주국밥맛","호가든맛","망고맛",
"잭푸르트맛","딸기맛","낙지탕탕이맛","마라샹궈맛","고향만두 콜라보 고기만두맛","코카콜라와 콜라보한 콜라맛","삼다수 콜라보 삼다수맛","민트맛","채끝살맛","훈제연어맛","까나리맛"];
const product_array = ["와를","스크류바를","더위사냥을","뽕따를","탱크보이를","와일드바디를","메로나를","옥동자를","폴라포를","구슬아이스크림을","빵또아를","월드콘을","부라보콘을","생귤탱귤을",
"조안나를","위즐을","셀렉트를","티코를","생귤탱귤을","토마토마를","쿠앤크를","아맛나를","캔디바를","수박바를","죠스바를","서주아이스바를","투게더를","요맘때를","설레임을","아시나요를",
"붕어싸만코를","국화빵을","호두마루를","구구콘을","빵빠레를","더블비얀코를","돼지바를","빠삐코를","누가바를","보석바를","비비빅을","쌍쌍바를","엔초를","엑설런트를","고드름을","냉장고 성에를"];

function randomIcecream() {
	try {
		let condition = Math.floor(Math.random()*condition_array.length);
		condition = (condition == condition_array.length) ? condition - 1:condition;
		let flavour = Math.floor(Math.random()*flavour_array.length);
		flavour = (flavour == flavour_array.length) ? flavour - 1:flavour;
		let product = Math.floor(Math.random()*product_array.length);
		product = (product == product_array.length) ? product - 1:product;

		return condition_array[condition] + " " + flavour_array[flavour] + " " + product_array[product]; 
	} catch (err) {
		sendErr(err);
	}
}

function removeCharacterWithName(name){
	try {
		let chas = findObjs({type:'character',name:name});
		chas.forEach(cha => {
			cha.remove();
		});
	} catch (err) {
		sendErr(err);
	}
}

function isIntroPlayedPlayer(id) {

	return state.introRecord[id] < scrtp.length;
}

function sendWhisperMsg(target, msg, isEnding) {

	try {
		if (msg) {
			let sender = findIDWithName(isEnding?soldier:tree);
			if (msg.startsWith('/as ')) {
				sender = msg.split(' ')[1];
				msg = msg.replace('/as '+ sender + ' ','');
			}
		
			sendChat(sender,'/w "' + target + '" ' + msg);
		} else {
			sendChat('🤖','/w "' + target + '" 뭔가 에러가 있어서 귓말이 취소됐는데 관리자한테 [**'+ msg + '**]라고 전해주세요.');
		}
	} catch (err) {
		sendErr(err);
	}
}

function sendErr(err) {
	sendChat('🤖','/w gm ' + err);
	sendChat('🤖','*에러가 발생했습니다. 관리자한테 뭔가 이상하다고 전해주세요.*');
}

function setQueueText(origin) {
	try {
		let array = [];
		let blank = "";
		for (let j = 0; j < 75; j++) {
			blank += " ";
		}
		array.push(blank);
		let text = "";
		if (origin) {
			text += origin;
		} else {
			for (let i = 0; i < state.currentQueue.length; i++) {
				const cha = getObj('character',state.currentQueue[i]);
				const pl = getObj('player',cha.get('controlledby'));
				if (!cha) {
					state.currentQueue.splice(i,1);
					i--;
				} else {
					let pl_name = "??";
					if (pl) {
						pl_name = pl.get('_displayname');
						if (!pl.get('_online')) {
							pl_name += "/" + "미접속";
						}
					}
					let add = (i > 0 ? ' / ' : '') + cha.get('name') + "(" + pl_name + ")";
					if ((text + add).length > 120) {
						array.push(text);
						text = "";
					}
					text += add;
				}
			}
		}
		array.push(text);
		const txtObj = findObjs({type:'text',font_size:16})[0];
		//텍스트의 내용을 변경
		txtObj.set('text',array.join('\n'));
	} catch (err) {
		sendErr(err);
	}
}

function orderWaitLine() {

	try {
		let order_index = -1;
		let offline_str = "순서가 돌아왔으나 접속하지 않은 ";
		for (let i = 0; i < state.currentQueue.length; i++) {
			const cha = getObj('character',state.currentQueue[i]);
			if (getObj('player',cha.get('controlledby')).get('_online')) {
				break;
			} else {
				order_index = i;
				offline_str += cha.get('name') + ",";
			}
		}
		if (order_index > -1) {
			let offlines = state.currentQueue.splice(0,order_index+1);
			for (let i = 0; i < offlines.length; i++) {
				state.currentQueue.splice(order_index+1+i,0,offlines[i]);
			}
			offline_str += " " + offlines.length + "명의 캐릭터가 뒤쪽 순서로 넘어갑니다."
			sendChat('🤖',offline_str);
		}
		return order_index;
	} catch (err) {
		sendErr(err);
	}
}

function callNextMagician(removeFirst) {
	try {
		if (removeFirst) {
			if (state.currentQueue.length > 0) {
				state.currentQueue.splice(0,1);
			}
		}
		const offline_idx = orderWaitLine();
		setQueueText();
		if (offline_idx < state.currentQueue.length) {
			const nc = getObj('character',state.currentQueue[0]);
			sendChat('🤖','NEXT -***' +  nc.get('name') + '***-');
		} else {
			sendChat('🤖','<현재 대기상태인 인원이 없습니다>',null,{noarchive:true});
		}
	} catch (err) {
		sendErr(err);
	}
}