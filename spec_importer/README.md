## 소개
캐릭터 시트의 특정 입력란에 이름을 적으면 데이터가 수록된 핸드아웃에서 나머지 내용을 가져와 시트에 자동으로 기입해주는 스크립트입니다.

## 사용법

spec_importer.js를 사용하기 위해서는 2가지를 설정해야 합니다.

#### - db_list
![](https://github.com/kibkibe/roll20-api-scripts/blob/master/wiki_image/si_1.png)

스크립트에 직접 입력하는 옵션으로서 JSON 형식의 코드입니다. 어느 DB로부터 어떤 값을 가져와서 시트상의 어느 `attribute`에 집어넣을지를 지정합니다.   

#### - DB핸드아웃
![](https://github.com/kibkibe/roll20-api-scripts/blob/master/wiki_image/si_2.png)

저널에 생성하는 핸드아웃입니다. 스크립트는 이 핸드아웃으로부터 데이터를 가져와 `db_list`에 지정한대로 시트에 값을 삽입합니다. 데이터들은 핸드아웃의 note에 지정된 형식에 맞춰 나열된 형태로 기입됩니다.


![](https://github.com/kibkibe/roll20-api-scripts/blob/master/wiki_image/si_3.png)

`db_list`와 `DB핸드아웃`은 서로 대응되는 값을 가집니다. `db_list`의 `data_handout`은 DB핸드아웃의 이름과 이어지고, DB핸드아웃의 한 항목 내의 요소들은 `db_list`의 `input_attr`에 입력된 1개 요소 및 `output_attrs`에 입력된 요소들과 각각 순서대로 대응됩니다. 자세한 사항은 아래의 도움말을 참조하세요.

## 준비1. db_list 적용
1. [[ import_spec.js ]](https://github.com/kibkibe/roll20-api-scripts/blob/master/spec_importer/spec_importer.js)의 코드를 복사하거나 [[ 통합 배포 페이지 ]](https://kibkibe.github.io/roll20/)에서 다른 스크립트와 합쳐진 코드를 가져옵니다.
2. 코드 내 옵션인 `is_setting`에서 `db_list`를 수정합니다. `db_list`는 사용할 검색조건을 나열하여 기입한 JSON 형식의 코드입니다. (도움말: [TCP School -JSON 구조](http://tcpschool.com/json/json_basic_structure))

#### 옵션
각각의 검색조건들은 `{ }`(대괄호)안에 쓰이며, 아래와 같은 설정값을 가집니다.

- `data_handout`: 이 검색조건이 값을 가져올 핸드아웃의 이름을 지정합니다.
- `input_attr`: 검색조건에 사용할 속성을 지정합니다. 사용자가 이 이름을 가진 속성을 변경하면 입력된 값을 키워드로 사용해 데이터를 검색합니다.
- `output_attrs`: 검색결과를 표시할 속성들을 지정합니다. `input_attr`에 입력된 값을 바탕으로 `data_handout`의 내용을 검색해서 적절한 항목을 탐색하면 그 결과값을 `output_attrs`에 있는 속성들의 입력란에 차례대로 집어넣습니다. 이 항목은 한번에 여러개를 입력할 수 있으며 `,`(쉼표)로 구분합니다.

> `input_attr`과 `output_attrs`에 사용되는 속성은 소지아이템이나 주문처럼 여러개를 기입해야 하는 항목일 수 있습니다. 이 경우 해당 속성의 이름 중 고정적으로 사용되는 부분만 남기고 유동적인 부분은 `*id*`로 대체할 수 있습니다. 아래 예시의 경우 오른쪽처럼 기입하면 왼쪽의 이름을 가진 속성들까지 모두 검색조건에 포함합니다.

![](https://github.com/kibkibe/roll20-api-scripts/blob/master/wiki_image/si_4.png)


아래는 아이템의 이름을 기입하면 `아이템목록`이라는 이름의 핸드아웃으로부터 해당 아이템의 유형, 등급, 대상, 효과를 가져오는 코드의 예시입니다.

       [
        {
         data_handout:"아이템목록",
         input_attr:"Item_*id*_Name",
         output_attrs:"Item_*id*_Type,Item_*id*_Level,Item_*id*_Target,Item_*id*_Effect"
         }
       ]

한번에 여러가지 검색조건을 함께 기입할 수 있습니다. 아래의 예시는 +버튼을 통해 반복생성되는 입력란을 검색조건에 추가한 코드입니다. 기존의 검색조건이 쓰인 `{ }`(대괄호) 아래에 또다른 `{ }`구문을 추가하고 쉼표로 구분했습니다. 이런 식으로 여러 검색조건을 `[ ]`(중괄호)로 표현되는 목록 안에 차례로 집어넣습니다.

       [
        {
         data_handout:"아이템목록",
         input_attr:"Item_*id*_Name",
         output_attrs:"Item_*id*_Type,Item_*id*_Level,Item_*id*_Target,Item_*id*_Effect"
         },
        {
         data_handout:"아이템목록",
         input_attr:"repeating_acitems_*id*_Item_Name",
         output_attrs:"repeating_acitems_*id*_Item_Type,repeating_acitems_*id*_Item_Level,repeating_acitems_*id*_Item_Target,repeating_acitems_*id*_Item_Effect"
        }
       ]

**준비2. DB핸드아웃 작성**
1. DB로 사용할 데이터를 수기입하거나 [데이터 변환 스프레드 시트](#데이터-변환-스프레드시트-사용법)를 이용해서 지정된 형식으로 작성합니다.   
각 항목은 `========`(=표시 8개)로 구분하며, 항목 내의 세부요소들은 `---`(-표시 3개)로 구분합니다.

       항목1---항목1요소1---항목1요소2---항목1요소3
       ========
       항목2---항목2요소1---항목2요소2---항목2요소3
       ========
       항목3---항목3요소1---항목3요소2---항목3요소3
       ========
       ...

> 형식이 올바르지 않거나 항목 내의 요소의 개수가 [옵션](#옵션)의 `db_list`에 지정된 숫자와 맞지 않을 경우 오류메시지를 표시합니다.

2. 핸드아웃을 신규 작성하고 note에 1의 문자열을 삽입한 후 저장합니다.

**준비3. 스크립트 적용**
1. 세션방의 대문에 해당하는 페이지에서 [설정]->[API 스크립트]를 선택해 스크립트 수정 페이지로 들어갑니다. (PRO 계정에서만 이 메뉴가 보입니다.)
2. 준비1 단계에서 작성한 코드를 입력하고 [Save Script]로 저장합니다.
3. 페이지 아래쪽의 API Output Console에 에러 메시지가 표시되지 않는다면 정상적으로 적용된 것입니다.

**준비4. 테스트**
1. 캐릭터 시트를 열고 [옵션](#옵션)의 `db_list`에서 `input_attr`에 기입한 속성에 해당되는 입력란에 임의의 항목명을 기입합니다.
2. `output_attr`에 지정된 입력란에 자동으로 값이 채워지는지 확인합니다.
> DB에 수록되지 않은 항목명을 입력한 경우 값이 채워지지 않습니다.

## 데이터 변환 스프레드시트 사용법

[[ 데이터 변환 스프레드시트 ]](https://docs.google.com/spreadsheets/d/1GXRU2gXd7rhXyf60cvU9OYC8vGGxOO8Iwm0XNO0hRms/edit#gid=5872866)

보유한 룰북 데이터를 스프레드시트에 입력해서 spec_importer.js에서 사용할 수 있는 형식으로 변환할 수 있도록 도와주는 시트입니다.

> 주의사항: 

