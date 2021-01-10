/* 설치법: https://github.com/kibkibe/roll20_api_scripts/wiki/%5B%EC%84%A4%EC%B9%98%EB%B2%95%5D-token_scripter.js */
/* (token_scripter.js) 201228 코드 시작 */
on("change:graphic", function(obj, prev) {
    try {
        if (obj.get('top') === prev.top && obj.get('left') === prev.left) return;
        if (obj.get('name') == 'ts_marker') {
            var areas = [];
            // option. 스크립트 내에서 카운트를 셀 경우 (ex: 라운드 수 처리 등) 마커토큰을 올려놨을 때 카운트가 +1될 영역토큰의 이름을 지정합니다.
            // 공백으로 둘 경우 카운트를 세지 않습니다.
            var final_token = '후공공격';

            let tokens = findObjs({bar3_value:'ts_area',_type:'graphic'});
            
            var left = obj.get('left');
            var top = obj.get('top');
            var width = obj.get('width');
            var height = obj.get('height');
            // option. 마커토큰이 영역토큰과 약간 어긋나도 인식되도록 오차범위(픽셀단위)를 설정합니다. 숫자가 작을수록 정확하고 엄격하게 판정합니다.
            let margin = 10;
            var count = obj.get('bar1_value');
            
            for (var z=0;z<tokens.length;z++) {
                var area = tokens[z];
                if (area.get('left')-area.get('width')/2 -margin <=left-width/2 &&
                    area.get('top')-area.get('height')/2 -margin<=top-height/2 &&
                    area.get('top')+area.get('height')/2 +margin>= top+height/2 &&
                    area.get('left')+area.get('width')/2 +margin>= left+width/2) {
                        let str = unescape(area.get('gmnotes')).replace('{count}',count);
                        if (str.includes('/desc')) {
                            str = str.replace('</p><p>','<br>');
                            let split = str.split('<br>');
                            for (var i=0;i<split.length;i++) {
                                sendChat("", split[i].replace(/(<([^>]+)>)/gi, ""));
                            }
                        } else {
                            sendChat("", str);
                        }
                        if (final_token.length > 0 && final_token == area.get('name')) {
                            obj.set('bar1_value', Number(obj.get('bar1_value')) + 1);
                        }
                        break;
                }
            }
        }
    } catch(err){
        sendChat("error","/w gm "+err,null,{noarchive:true});
    }
});
/* (token_scripter.js) 201228 코드 종료 */