/* https://github.com/kibkibe/roll20-api-scripts/tree/master/as_selector */
/* (as_selector.js) 211122 코드 시작 */

on("chat:message", function(msg){
	// on.chat:message:api
    if (msg.type == "api"){
        if (msg.content.startsWith('!!') && playerIsGM(msg.playerid)) {
            const player = getObj('player',msg.playerid);
            const keyword = msg.content.replace('!!','');
            let cha = filterObjs(function(obj){
                return (obj.get('type') == 'character' &&
                obj.get('name').includes(keyword) &&
                (obj.get('controlledby') == '' || playerIsGM(obj.get('controlledby'))));
            });
            if (cha.length > 0) {
                let nearestIndex = 9999;
                let lastCheckedIdx = 0;
                for (let i=0;i<cha.length;i++) {
                    const idx = cha[i].get('name').indexOf(keyword);
                    if (idx < nearestIndex) {
                        nearestIndex = idx;
                        lastCheckedIdx = i;
                    }
                }
                player.set('speakingas','character|'+cha[lastCheckedIdx].get('_id'));
            }
        }
    }
	// /on.chat:message:api
});
/* (as_selector.js) 211122 코드 종료 */