/*
	* by 양천일염
	* https://github.com/kibkibe/roll20_api_scripts

	[ 소개 ]
	이 스크립트에는 Roll20에서 ORPG를 진행하며 사용할 수 있는 2가지 기능이 포함되어 있습니다.
	
	1. 화면에 배치된 토큰의 이미지 URL을 가져올 수 있습니다. (명령어: !add)
	2. 화면에 배치된 토큰의 이미지를 변경할 수 있습니다. (명령어: !replace 이미지주소)

	[ 설치법 ]
	1. roll20 세션방의 대문에 해당하는 페이지에서 [설정]->[API 스크립트]를 선택해 스크립트 수정 페이지로 들어갑니다. (PRO 계정에서만 이 메뉴가 보입니다.)
	2. New Script에 이 코드들을 복사해 붙여놓고 [Save Script]로 저장합니다. 
	3. 페이지 아래쪽의 API Output Console에 에러 메시지가 표시되지 않는다면 정상적으로 적용된 것입니다. 세션방에서 테스트를 진행할 수 있습니다.
	
	[ 테스트&사용법 ]
	1. 주소를 알아오고 싶은 토큰이나 객체를 마우스로 클릭하여 선택 후 채팅창에 '!add'라고 입력합니다.
	2. 이미지 주소가 GM귓말로 잘 오는지를 확인합니다.
	3. 가져온 이미지 주소를 복사하고 바꾸고 싶은 토큰을 클릭합니다.
	4. 채팅창에 '!replace 이미지주소'를 입력하고 토큰 이미지가 잘 바뀌는지 확인합니다.
	
	[ 주의사항 ]
	1. 토큰 이미지는 Roll20 라이브러리에 있는 이미지만 등록할 수 있습니다.
	   외부링크는 동작하지 않으니 주의하세요.
	
*/
/* (get_set_img_url.js) 201226 코드 시작 */
on("chat:message", function(msg)
{
if (msg.type == "api"){
	try {
		if (msg.content.indexOf("!add") === 0) {
			var tok = getObj("graphic", msg.selected[0]._id);
			sendChat(msg.who,"/w gm "+tok.get('imgsrc'));
		} else if (msg.content.indexOf("!replace ") === 0) {
			var tok = getObj("graphic", msg.selected[0]._id);
			tok.set('imgsrc',msg.content.substring(9).replace("max","thumb").replace("med","thumb"));
		} else if (msg.content.indexOf("!log") === 0) {
			for (var i=0;i<msg.selected.length;i++) {
			    var tok = getObj("graphic", msg.selected[i]._id);
		        log(tok);
			}
		} else if (msg.content.indexOf("!batch") === 0 && msg.selected.length > 0) {
			let highest = msg.selected[0];
			for (var i=0;i<msg.selected.length;i++) {
				var tok = getObj("graphic", msg.selected[i]._id);
				if (highest.get('top') > tok.get('top')) {
					highest = tok;
				}
			}
			for (var i=0;i<msg.selected.length;i++) {
				var tok = getObj("graphic", msg.selected[i]._id);
				tok.set("imgsrc", highest.get('imgsrc').replace("max","thumb").replace("med","thumb"));
			}
		}
	} catch(err){
		sendChat("error","/w gm "+err,null,{noarchive:true});
	}
}
});
/* (get_set_img_url.js) 201226 코드 종료 */
