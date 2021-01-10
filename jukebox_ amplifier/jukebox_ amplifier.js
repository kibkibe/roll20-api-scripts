/* 설치법: https://github.com/kibkibe/roll20_api_scripts/wiki/%5B%EC%84%A4%EC%B9%98%EB%B2%95%5D-jukebox_amplifier.js */
/* (jukebox_amplifier.js) 201226 코드 시작 */
on("chat:message", function(msg)
{
if (msg.type == "api"){
    if (msg.content.indexOf("!amplify") === 0) { //명령어를 변경하실 수 있습니다.
		try {
			var jukebox = findObjs({_type: "jukeboxtrack"});
			for (var i=0;i<jukebox.length;i++) {
				var obj = jukebox[i];
				if(msg.content.includes("loop")){
					obj.set({volume: 100, loop:true});
				} else {
					obj.set({volume: 100});
				}
			}
		} catch(err){
			sendChat("error","/w gm "+err,null,{noarchive:true});
		}
    }
}
});
/* (jukebox_amplifier.js) 201226 코드 종료 */
