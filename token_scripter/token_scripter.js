/* https://github.com/kibkibe/roll20-api-scripts/tree/master/token_scripter */
/* (token_scripter.js) 210121 코드 시작 */
on("change:graphic", function(obj, prev) {
    try {
        if (obj.get('top') === prev.top && obj.get('left') === prev.left) return;
        if (obj.get('name') == 'ts_marker') {  
            const left = obj.get('left');
            const top = obj.get('top');
            const width = obj.get('width');
            const height = obj.get('height');
            // option. 마커토큰이 영역토큰과 약간 어긋나도 인식되도록 오차범위(픽셀단위)를 설정합니다. 숫자가 작을수록 정확하고 엄격하게 판정합니다.
            const margin = 10;
            // option.  /as,/emas,/desc 명령이 포함되지 않는 메시지를 표시할 기본 캐릭터를 설정합니다. 공백으로 설정시 채팅에 이름을 표시하지 않습니다.
            const default_character = "GM";

            const results = filterObjs(function(area) {    
                if (area.get('_type') == 'graphic' && area.get('bar3_value') =='ts_trigger' &&
                area.get('left')-area.get('width')/2 -margin <=left-width/2 &&
                area.get('top')-area.get('height')/2 -margin<=top-height/2 &&
                area.get('top')+area.get('height')/2 +margin>= top+height/2 &&
                area.get('left')+area.get('width')/2 +margin>= left+width/2) {
                    return true;
                } else return false;
            });

            const getDefaultName = function() {
                let as_who = findObjs({_type: "character", name: default_character});
                if (as_who.length > 0) {
                    as_who = "character|" + as_who[0].get('_id');
                } else {
                    as_who = findObjs({_type: "player", _displayname: default_character});
                    if (as_who.length > 0) {
                        as_who = "player|" + as_who[0].get('_id');
                    } else {
                        as_who = default_character;
                    }
                }
                return as_who;
            }

            if (results && results.length > 0) {
                var area = results[0];
                let attr = {};
                if (obj.get('gmnotes').length > 0) {
                    try {
                        attr = JSON.parse(unescape(obj.get('gmnotes')).replace(/(<([^>]+)>)/gi, ""));
                    } catch (err) {
                        sendChat("error","/w gm GM 노트에 기입된 텍스트의 형식이 맞지 않아 값을 초기화합니다. 기존에 입력된 값은 아래와 같습니다.<br>**" + unescape(obj.get('gmnotes')) +"**",null,{noarchive:true});
                        obj.set('gmnotes','');
                    }
                }

                let str = unescape(area.get('gmnotes'));
                str = str.replace(/<\/p>/g,'<br>');
                let split = str.split('<br>');
                for (var i=0;i<split.length;i++) {

                    let final_str = split[i];
                    const attr_match = final_str.match(/\{\{[^\}]+\}\}/g,'');
                    if (attr_match) {
                        attr_match.forEach(item => {
                            if (item.includes(":")) {
                                const attr_split = item.split(":");
                                let add_value = parseInt(attr_split[1].replace(/[{}]/g,''));
                                add_value = isNaN(add_value) ? 0 : add_value;
                                let current_value = parseInt(attr[attr_split[0].replace(/[{}]/g,'')]);
                                current_value = isNaN(current_value)  ? 0:current_value;
                                attr[attr_split[0].replace(/[{}]/g,'')] = current_value + add_value;
                                final_str = final_str.replace(item,'');
                            } else {
                                let current_value = parseInt(attr[item.replace(/[{}]/g,'')]);
                                current_value = isNaN(current_value)  ? 0:current_value;
                                final_str = final_str.replace(item,current_value);
                            }
                        });
                    }
                    const tag_match = final_str.match(/(<([^>]+)>)/gi);
                    let is_rich_text = false;
                    if (tag_match) {
                        tag_match.forEach(item => {
                            if (item.search(/<\/*[pbi]>/gi) < 0) {
                                is_rich_text = true;
                            }
                        });
                    }
                    log(final_str);
                    if (is_rich_text) {
                        if (final_str.indexOf('!...') > -1) {
                            final_str = final_str.replace(/\!\.\.\.\s*/g,"");
                            final_str = "!..." + final_str;
                        }
                        sendChat(getDefaultName(), final_str);
                    } else {

                        let as_who;
                        final_str = final_str.replace(/(<([^>]+)>)/gi, "");

                        if (final_str.indexOf("/desc") == 0) {
                            as_who = '';
                        } else if (final_str.indexOf("/as") == 0 || final_str.indexOf("/emas") == 0) {
                            const arr = final_str.split('"');
                            let cha = findObjs({_type: "character", name: arr[1]})[0];
                            if (cha) {
                                as_who = "character|" + cha.get('_id');
                            } else {
                                as_who = arr[1];
                            }
                            if (final_str.indexOf("/emas") == 0) {
                                final_str = "/em " + final_str.substring('/emas '.length + arr[1].length + 3);
                            } else {
                                final_str = final_str.substring('/as '.length + arr[1].length + 3);
                            }
                        } else {
                            as_who = getDefaultName();
                        }
                        sendChat(as_who, final_str);
                    }
                    obj.set('gmnotes',JSON.stringify(attr));
                }
            }
        }
    } catch(err){
        sendChat("error","/w gm "+err,null,{noarchive:true});
    }
});
/* (token_scripter.js) 210121 코드 종료 */