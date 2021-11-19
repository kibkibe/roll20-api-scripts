/* https://github.com/kibkibe/roll20-api-scripts/tree/master/spec_importer */
/* (spec_importer.js) 211119 코드 시작 */

// define: option
const si_setting = {
	// option: 검색에 사용할 조건들과 검색결과를 적용할 속성들을 형식에 맞춰 입력합니다.
	// 룰별 db_list코드 공유페이지 https://docs.google.com/spreadsheets/d/1GXRU2gXd7rhXyf60cvU9OYC8vGGxOO8Iwm0XNO0hRms/edit#gid=5872866
	db_list:
	/* DB리스트 시작 */
	[{data_handout:'아이템일람', input_attr:"relation_name_*id*", output_attrs:"relation_*id*"},
	{data_handout:'마법일람', input_attr:"Magic_*id*_Name", output_attrs:"Magic_*id*_Types,Magic_*id*_Assigned_Skill,Magic_*id*_skillTarget,Magic_*id*_Cost,Magic_*id*_Effect,Magic_*id*_Recite"},
	{data_handout:'마법일람', input_attr:"repeating_acitems_*id*_Magic_Name", output_attrs:"repeating_acitems_*id*_Magic_Types,repeating_acitems_*id*_Magic_Assigned_Skill,repeating_acitems_*id*_Magic_skillTarget,repeating_acitems_*id*_Magic_Cost,repeating_acitems_*id*_Magic_Effect,repeating_acitems_*id*_Magic_Recite"}]
	/* DB리스트 끝 */
}
// /define: option
    
on('ready', function() {
	// on.ready
    on("add:attribute", function(obj) {
		check_spec(obj);
    });
	// /on.ready
});

on("change:attribute", function(obj, prev) {
	// on.change:attribute
	check_spec(obj);
	// /on.change:attribute
});

// define: global function
function check_spec(obj) {
	try {
		if (obj.get('current')) {
			let name = obj.get('name');
			let target;
			let id;
			si_setting.db_list.forEach(item => {
				const split = item.input_attr.split("*id*");
				if (split.length != 2 && name == item.input_attr) {
					id = null;
					target = item;
				} else if (name.startsWith(split[0]) && name.endsWith(split[1])) {
					id = name.replace(split[0],'').replace(split[1],'');
					target = item;
				}
			});
			if (target) {
				const output_attrs = target.output_attrs.split(/\s*,\s*/);
				let dataset = findObjs({type:'handout',name:target.data_handout});
				if (dataset.length == 0) {
					sendChat("error","/w gm 저널에 이름이 '"+target.data_handout+"'인 핸드아웃이 없습니다.",null,{noarchive:true});
					return;
				} else if (dataset.length > 1) {
					sendChat("error","/w gm 저널에 이름이 '"+target.data_handout+"'인 핸드아웃이 2개 이상 있습니다. 먼저 생성된 핸드아웃에서 데이터를 가져옵니다.",null,{noarchive:true});
				}
				dataset[0].get('notes',function(note){
					let data = note.replace(/\<\/p\>\<p\>========/g,'========').replace(/========\<\/p\>\<p\>/g,'========').replace(/\<\/p\>\<p\>/g,'\n').replace(/(<([^>]+)>)/gi, '').split('========');
					const spec_name = obj.get('current').replace(/ /g,'');
					for (let index = 0; index < data.length; index++) {
						let item = data[index].split('---');
						if (item.length != output_attrs.length+1) {
							sendChat("error","/w gm 아래 항목이 올바르지 않은 양식으로 입력되었습니다.<br>" + item,null,{noarchive:true});
							return;
						}
						if (item[0].replace(/ /g,'') == spec_name) {
							for (let j = 0; j < output_attrs.length; j++) {
								const attr = output_attrs[j];
								let condition = {type:'attribute',name:id?attr.replace('*id*',id):attr,characterid:obj.get('_characterid')};
								let attr_obj = findObjs(condition);
								if (attr_obj.length == 0) {
									let attr = createObj('attribute',condition);
									condition.current = item[j+1];
									attr.setWithWorker(condition);
								} else {
									condition.current = item[j+1];
									attr_obj[0].setWithWorker(condition);
									for (let k = 1; k < attr_obj.length; k++) {
										attr_obj[k].remove();
									}
								}
							}
						}
					}
				});
			}
		}
									
	} catch (error) {
	}
}
// /define: global function
/* (spec_importer.js) 211119 코드 종료 */