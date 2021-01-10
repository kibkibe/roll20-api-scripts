/* 설치법: https://github.com/kibkibe/roll20_api_scripts/wiki/%5B%EC%84%A4%EC%B9%98%EB%B2%95%5D-magicalogia_resist.js */
/* (magicalogia_resist.js) 201101 코드 시작 */
on("chat:message", function(msg)
{
if (msg.type == "api"){
    if (msg.content.indexOf("!저항") === 0) { //명령어는 변경하셔도 됩니다. 시작은 무조건 느낌표.
        try {
            var table = [
                ['황금','대지','숲','길','바다','정적','비','폭풍','태양','천공','이계'],
                ['살','벌레','꽃','피','비늘','혼돈','이빨','외침','분노','날개','에로스'],
                ['중력','바람','흐름','물','파문','자유','충격','우레','불','빛','원환'],
                ['이야기','선율','눈물','이별','미소','마음','승리','사랑','정열','치유','시간'],
                ['추억','수수께끼','거짓','불안','잠','우연','환각','광기','기도','희망','미래'],
                ['심연','부패','배신','방황','나태','왜곡','불행','바보','악의','절망','죽음']
            ];
            var split = msg.content.split(' --');
            if (split.length < 3) { sendChat('error','/w GM 명령 형식이 올바르지 않습니다.',null,{noarchive:true}); return false; }
            var name = split[1].split(' ')[0].substring(0, split[1].split(' ')[0].length-1);
            var target = split[2];
            var target_x=-1;
            var target_y=-1;
            var arche_x=-1;
            var arche_y=-1;
            for (var i=0;i<table.length;i++) {
                for (var j=0;j<table[i].length;j++) {
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
            if (target_x == -1 || target_y == -1 || arche_x == -1 || arche_y == -1) { sendChat('error','/w GM 원형 혹은 판정할 특기의 이름이 잘못되었습니다.',null,{noarchive:true}); return;}
            var res_target = 5 + Math.abs(target_x-arche_x)*2 + Math.abs(target_y-arche_y);
            if (target_x != arche_x) { res_target -= 1; }
            if (res_target > 12) { res_target = 12; }
            sendChat("","*<" + split[1] + ">*, **" + target + "**의 저항목표치: **[ " + res_target + " ]**");
            
        } catch (err) {
            sendChat('error','/w GM '+err,null,{noarchive:true});
        }
    }
}
});
/* (magicalogia_resist.js) 201101 코드 종료 */