/* 설치법: https://github.com/kibkibe/roll20_api_scripts/wiki/%5B%EC%84%A4%EC%B9%98%EB%B2%95%5D-magicalogia_install_magic.js */
/* (magicalogia_install_magic.js) 201226 코드 시작 */
on("chat:message", function(msg)
{
if (msg.type == "api"){
if (msg.content.indexOf("!장서 ") === 0) {
    try {
	    if (msg.selected) {
	        var tok = getObj("graphic", msg.selected[0]._id);
    	    if (tok && tok.get('represents')) {
    	        try {
    	        var proc_msg = msg.content.replace("!install_magic ").replace("{{").replace("}}");
    	        var cha_id = getObj("character", tok.get('represents')).get('_id');
    	        var list = proc_msg.split("<br/>\n");
    	        var attr_list = [
    	            "Magic_*num*_Name",
    	            "Magic_*num*_Types",
    	            "Magic_*num*_Assigned_Skill",
    	            "Magic_*num*_Cost",
    	            "Magic_*num*_Effect",
    	            "Magic_*num*_Recite",
    	            "ima_show_cust_*num*"];
    	        var idx = 1;
    	        
    	        var repeat_id_list = [];
    	        var attrs = findObjs({_type: "attribute", _characterid: cha_id});
    	        for (var i=0;i<attrs.length;i++) {
    	            var item = attrs[i].get('name');
    	            if (item.includes('repeating_') && item.includes('_Magic_Name')) {
    	                repeat_id_list.push(item.replace('_Magic_Name',''));
    	            }
    	        }
    	        
    	        var find_key = function(str){
    	            var attr_from_value = findObjs({_type: "attribute", _characterid: cha_id, current: str});
    	            for (var i=0;i<attr_from_value.length;i++) {
    	                var attr = attr_from_value[i].get('name');
    	                if (!attr.includes('Magic')) {
    	                    return attr;
    	                }
    	            }
    	        }
    	        
    	        for (var i=0;i<list.length;i++) {
        	        var items = list[i].split(" --");
        	        if (items.length > 1) {
        	            idx++;
        	            for (var j=0;j<items.length;j++) {
        	                var name, attr, item;
        	                if (idx < 11) {
        	                    name = attr_list[j].replace("_*num*", "_"+ ("0"+idx).slice(-2));
        	                    attr = findObjs({_type: "attribute", _characterid: cha_id, name:name})[0];
        	                } else {
        	                    name = repeat_id_list[idx-11] + "_" + attr_list[j].replace("_*num*", "");
        	                    attr = findObjs({_type: "attribute", _characterid: cha_id, name:name})[0];
    	        
        	                }
        	                item = items[j];
        	                if (j==1||j==2) {
        	                    var attr_key = find_key(item);
        	                    if (attr_key) {
        	                        item = "@{" + attr_key + "}";
        	                    }
        	                }
        	                
        	                if (!attr && repeat_id_list.length > idx - 11) {
        	                    attr = createObj('attribute', {
                                characterid: cha_id,
                                name: name,
                                current: item});
        	                } else if (attr) {
        	                    attr.set({current:item});
        	                }
        	            }
        	        }
    	        }
    	        }  catch(err) {
                    sendChat("error", "/w gm "+err,null,{noarchive:true});
                }
    	    } else {
                    sendChat("error", "/w gm 캐릭터 토큰이 선택되지 않았습니다.",null,{noarchive:true});
    	    }
        } else {
            sendChat("error", "/w gm 토큰이 선택되지 않았습니다.",null,{noarchive:true});
    	}
    } catch(err){
        sendChat("error","/w gm "+err,null,{noarchive:true});
    }
    }
}
});
/* (magicalogia_install_magic.js) 201226 코드 종료 */