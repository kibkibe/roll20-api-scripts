/* https://github.com/kibkibe/roll20-api-scripts/tree/master/avatar_setter */
/* (avatar_setter.js) 211024 코드 시작 */

on('ready', function() {
	// on.ready
    on("add:character",function(obj) {
		obj.get('bio',function(bio){
			if ((!bio || bio.length == 0) && (!obj.get('avatar') || obj.get('avatar').length == 0)) {
				obj.set('bio', '<b>avatar_setter.js</b><br>이 bio에 다른 세션에서 쓰인 캐릭터의 이미지 URL을 입력하면 아바타에 바로 적용됩니다.');
			}
		});
    });
	// /on.ready
});

on("change:character:bio", function(obj, prev) {
	// on.change:character:bio
	obj.get('bio',function(bio){
		const clearBio = bio.replace(/(<([^>]+)>)/gi, "");
		if (clearBio.indexOf('https://') == 0) {
			obj.set('avatar', clearBio);
			if (obj.get('avatar') != clearBio) {
				obj.set('bio', '아바타로 사용할 수 없는 이미지 URL입니다.');
			} else {
				obj.set('bio', '');
			}
		}
	});
	// /on.change:character:bio
});
/* (avatar_setter.js) 211024 코드 종료 */