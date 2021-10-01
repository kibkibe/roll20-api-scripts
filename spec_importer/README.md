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


## 준비1. db_list 적용
1. [[ spec_importer.js ]](https://github.com/kibkibe/roll20-api-scripts/blob/master/spec_importer/spec_importer.js)의 코드를 복사하거나 [[ 통합 배포 페이지 ]](https://kibkibe.github.io/roll20/)에서 다른 스크립트와 합쳐진 코드를 가져옵니다.
2. 코드 내 옵션인 `si_setting`에서 `db_list`를 수정합니다. `db_list`는 사용할 검색조건을 나열하여 기입한 JSON 형식의 코드입니다. (도움말: [TCP School -JSON 구조](http://tcpschool.com/json/json_basic_structure))

#### 옵션
각각의 검색조건들은 `{ }`(대괄호)안에 쓰이며, 아래와 같은 설정값을 가집니다.

- `data_handout`: 이 검색조건이 값을 가져올 핸드아웃의 이름을 지정합니다.
- `input_attr`: 검색조건에 사용할 속성을 지정합니다. 사용자가 이 이름을 가진 속성을 변경하면 입력된 값을 키워드로 사용해 데이터를 검색합니다.
- `output_attrs`: 검색결과를 표시할 속성들을 지정합니다. `input_attr`에 입력된 값을 바탕으로 `data_handout`의 내용을 검색해서 적절한 항목을 탐색하면 그 결과값을 `output_attrs`에 있는 속성들의 입력란에 차례대로 집어넣습니다. 이 항목은 한번에 여러개를 입력할 수 있으며 `,`(쉼표)로 구분합니다.

> `input_attr`과 `output_attrs`에 사용되는 속성은 소지아이템이나 주문처럼 여러개를 기입해야 하는 항목일 수 있습니다. 이 경우 해당 속성의 이름 중 고정적으로 사용되는 부분만 남기고 유동적인 부분은 `*id*`로 대체할 수 있습니다. 아래 예시의 경우 오른쪽처럼 기입하면 왼쪽의 이름을 가진 속성들까지 모두 검색조건에 포함합니다.

![](https://github.com/kibkibe/roll20-api-scripts/blob/master/wiki_image/si_3.png)


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

2. 핸드아웃을 신규 작성하고 note에 1의 문자열을 삽입한 후 `db_list`의 `data_handout`에 지정한 것과 동일한 이름으로 변경한 뒤 저장합니다.

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

보유한 룰북 데이터를 스프레드시트에 입력해서 spec_importer.js에서 사용할 수 있는 형식으로 변환해주는 시트입니다.

### 주의사항
룰북 데이터를 입력한 시트 및 변환된 결과물은 개인적으로만 보유하세요.   
이 페이지에서는 스크립트와 변환툴만을 제공하며 **실데이터의 무단공유로 인해 발생하는 저작권 위반문제에 관여하지 않습니다**.

### 사용법

1. 개인계정의 구글드라이브에 임의의 이름으로 새 스프레드시트를 생성합니다.
2. 생성된 시트에 데이터를 입력합니다. 하나의 행(가로)은 개별 아이템이고 열(세로)에 그 아이템의 속성들을 각각 입력합니다.

![](https://github.com/kibkibe/roll20-api-scripts/blob/master/wiki_image/si_4.png)

`db_list`와 `DB핸드아웃`은 서로 대응되는 값을 가집니다. `db_list`의 `data_handout`은 DB핸드아웃의 이름과 이어지고, DB핸드아웃의 한 항목 내의 요소들은 `db_list`의 `input_attr`에 입력된 1개 요소 및 `output_attrs`에 입력된 요소들과 각각 순서대로 대응됩니다.   
이에 맞춰서 데이터를 입력하는 시트에는 A번째 열에 각 아이템의 이름을 기입하고 이어서 B,C,D...열에는 `db_list`의 `output_attrs`에 속성을 입력한 것과 동일한 순서로 요소들을 기재합니다. 위의 스크린샷은 아이템의 유형, 등급, 대상, 효과 순으로 데이터를 입력하는 경우의 예시입니다.

3. 캐릭터 시트가 다국어를 지원한다면 일부 속성은 한글로 된 미가공 데이터를 인식하지 못할 수 있습니다.   
가령 마기카로기아의 경우 장서의 타입이 `소환`,`주문`,`장비`의 3개지만 Roll20에 등록된 시트에서는 실제 값을 `@{summon}`,`@{spell}`,`@{equip}`으로 입력해야 제대로 값이 표시됩니다.   
이 경우 다국어 코드로 변경하는 과정이 필요합니다. Roll20 공식 GitHub의 [[ 캐릭터 시트 공유소 ]](https://github.com/Roll20/roll20-character-sheets)에서 사용하고자 하는 룰의 시트를 찾아 `translations/ko.json` 파일을 참조하면 어떤 값들이 다국어 지원사항에 해당되고 어떤 문자로 수정해야 하는지 알 수 있습니다.


![](https://github.com/kibkibe/roll20-api-scripts/blob/master/wiki_image/si_8.png)

스크린샷에서 `:`을 기준으로 오른쪽이 표시-사용되는 값이고 왼쪽의 영어가 다국어 코드입니다. 데이터를 입력한 스프레드시트에서 ctrl+F로 변환이 필요한 항목들을 검색한 다음 `@{다국어코드}`로 바꾸기 작업을 하면 캐릭터 시트에서 올바르게 표시됩니다.


4. 데이터를 입력한 시트의 이름을 `데이터`로 바꾸고 [[ 데이터 변환 스프레드시트 ]](https://docs.google.com/spreadsheets/d/1GXRU2gXd7rhXyf60cvU9OYC8vGGxOO8Iwm0XNO0hRms/edit#gid=696285529)에서 `데이터_변환시트` 시트를 2.의 스프레드시트로 복사합니다.

![](https://github.com/kibkibe/roll20-api-scripts/blob/master/wiki_image/si_5.png)

> 이 작업 이전에 가급적 데이터가 입력된 시트는 편집을 마쳐놓는 것이 좋습니다. `데이터` 시트의 열을 삭제하거나 하면 `데이터_변환시트`에서 이 열을 참조하고 있는 함수들이 #REF!에러를 일으킬 수 있습니다. 이 문제가 발생할 경우 에러가 표시되는 시트를 삭제하고 배포페이지의 원본으로부터 `데이터_변환시트`를 새로 복사해오세요.

5. 2.의 스프레드시트로 돌아가 3.에서 복사해온 `데이터_변환시트`의 사본을 열고 `A2`번 셀의 함수를 수정합니다.

	=JOIN("---",'데이터'!$A1:'데이터'!$E1)

여기서 뒤쪽의 `!$E1`에 해당하는 부분을 2.에서 입력한 데이터에 맞춰 변경합니다.   
가령 아이템의 세부항목이 3개라서 아이템명까지 포함해 A,B,C,D의 4개 열만 사용할 경우 마지막 열의 번호인 `!$D1`으로 수정합니다. 세부항목이 많아서 G열까지 데이터를 입력했을 경우 `!$G1`으로 수정합니다.

![](https://github.com/kibkibe/roll20-api-scripts/blob/master/wiki_image/si_6.png)

6. 수정한 `A2`번 셀을 마우스로 클릭한 뒤 셀의 우측 하단에 생성된 네모난 꼭지를 잡고 아래로 쭉 드래그합니다. 입력된 데이터상의 아이템이 200개라면(=200행에 걸쳐 입력되어 있다면) `A201`행까지 끌어내려서 총 200개의 항목이 1차 변환되도록 합니다.

![](https://github.com/kibkibe/roll20-api-scripts/blob/master/wiki_image/si_7.png)


7. 6.작업을 마치면 A열에 있는 1차 변환된 값들이 B열에 100개씩 합쳐져서 표시됩니다. 이 중에서 값이 제대로 변환된 셀만 마우스로 드래그해서 선택한 뒤 ctrl+C로 복사합니다.

![](https://github.com/kibkibe/roll20-api-scripts/blob/master/wiki_image/si_9.png)

8. 7에서 복사한 텍스트를 바로 사용할 수도 있지만 본문 안에 줄바꿈이 있었다면 불필요한 `"`(큰따옴표)표시가 추가되었을 수 있습니다. 메모장 등의 텍스트 편집기에 붙여넣고 큰따옴표를 삭제하는 작업을 거칩니다.
8. 1. ctrl+F로 큰따옴표가 연달아 2개 붙은 `""`를 검색해서 `afw3as`와 같이 다른 글자와 겹치지 않을 임의의 문자로 변경합니다. 실제 본문에 포함된 큰따옴표를 보존하기 위해서입니다.
8. 2. ctrl+F로 `"`(큰따옴표)를 검색해 일괄 삭제합니다.
8. 3. ctrl+F로 8.1.에서 입력한 임의의 문자를 다시 `"`(큰따옴표)로 변경합니다.

9. Roll20의 세션방에서 새 핸드아웃을 만들고 note에 8에서 수정한 텍스트를 복사해서 붙여넣습니다.

10. 핸드아웃의 이름을 `db_list`의 `data_handout`에 지정한 것과 동일하게 변경한 뒤 저장합니다.
