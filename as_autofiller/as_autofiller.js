/* https://github.com/kibkibe/roll20-api-scripts/tree/master/as_autofiller */
/* (as_autofiller.js) 210119 코드 시작 */
on("chat:message", function(msg)
{
if (msg.type == "api" && (msg.playerid == 'API' || playerIsGM(msg.playerid))){
    const api_tag = '<a href="#vd-permitted-api-chat"></a>';
    try {
        let command = "!!";
        const master_name = "GM"; //토큰을 선택하지 않고 명령어를 사용했을 때 기본적으로 표시될 캐릭터의 이름을 기입해주세요.
        let false_value = 9999;
        if (msg.content.indexOf(command) === 0) {
            let keyword = msg.content.split(' ')[0];
            if (keyword) {
                if (keyword.length > command.length) {
                    keyword = keyword.replace("!!","");
                    let characters = findObjs({type:'character'});
                    let nearest_item = {idx:false_value,match_idx:false_value};
                    for (let i=0;i<characters.length;i++) {
                        let cha = characters[i];
                        let controller = cha.get('controlledby').split(",");
                        let is_npc = true;
                        for (let j=0;j<controller.length;j++) {
                            if (controller[j] == "all" || (controller[j].length > 0 && !playerIsGM(controller[j]))) {
                                is_npc = false;
                                break;
                            }
                        }
                        if (is_npc) {
                            let match_idx = cha.get('name').indexOf(keyword);
                            if (match_idx > -1 && match_idx < nearest_item.match_idx) {
                                nearest_item = {idx:i,match_idx:match_idx};
                            }
                        }
                    }
                    if (nearest_item.idx != false_value) {
                        sendChat("character|"+characters[nearest_item.idx].get('id'),
                        msg.content.substring(command.length+ keyword.length+1, msg.content.length)+(api_tag&&!msg.content.includes(api_tag)?api_tag:""));
                    } else {
                        sendChat("as_autofiller.js", "/w gm **" + keyword + "**가 이름에 포함된 NPC가 없습니다.",null,{noarchive:true});
                    }
                } else {
                    let chat_id = "";
                    if (master_name.length == 0) {
                        sendChat("system","/w gm 이름의 길이가 0글자인 캐릭터를 통해 API로 채팅할 경우 이름이 올바르게 출력되지 않아 익명의 공백이름으로 표시되었습니다. \
                        아바타를 사용하면서 캐릭터의 이름을 보이지 않기를 원하실 경우 이름을 공백으로 두는 대신 **공백문자**(스페이스바 등)를 1글자 넣어주세요.",null,{noarchive:true});
                    } else {
                        const gm = findObjs({ name: master_name, type: 'character'})[0];
                        if (gm) {
                            chat_id = "character|"+gm.get("_id");
                        } else {
                            sendChat("system","/w gm **!!** 뒤에 입력한 키워드가 없고 이름이 '" + master_name + "'인 캐릭터가 저널에 없습니다.",null,{noarchive:true});
                            return;
                        }
                    }
                    sendChat(chat_id,msg.content.substring(3) +(!msg.content.includes(api_tag)?api_tag:""));
                }
            }
        }
    } catch (err) {
        sendChat("error","/w gm " + err,null,{noarchive:true});
    }
}
});
/* (as_autofiller.js) 210119 코드 종료 */