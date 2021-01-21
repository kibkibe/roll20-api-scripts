## 소개
토큰을 특정한 위치에 이동시키면 지정된 메시지를 표시해주는 스크립트입니다.  
안내메시지를 표시하거나, 미리 설정한 대사를 보여주거나, 전투의 라운드를 쉽게 진행할 수 있도록 도와줍니다.  
narrator.js와 호환됩니다.

## 설치법
### 준비1. 스크립트 적용하기
[[ 스크립트 공통 설치법 안내 페이지 ]](https://github.com/kibkibe/roll20-api-scripts/wiki) 바로가기
1. roll20 세션방의 대문에 해당하는 페이지에서 [설정]->[API 스크립트]를 선택해 스크립트 수정 페이지로 들어갑니다. (PRO 계정에서만 이 메뉴가 보입니다.)
2. New Script에 [ 코드 본문 ](https://github.com/kibkibe/roll20-api-scripts/blob/master/token_scripter/token_scripter.js)을 복사해 붙여넣습니다.
3. 코드 내의 주석을 참조해 옵션을 설정합니다.
4. [Save Script]를 눌러 저장합니다. 페이지 아래쪽의 API Output Console에 에러 메시지가 표시되지 않는다면 정상적으로 적용된 것입니다.

### 준비2. 마커 토큰 배치
![x](https://github.com/kibkibe/roll20-api-scripts/blob/master/wiki_image/ts/1_1.png)
1. 움직이는데 사용할 토큰을 생성하고 이름을 `ts_marker`로 설정합니다.  
2. GM만 이 토큰을 사용할지 플레이어가 움직일 수 있게 할지에 따라서 제어 권한을 설정합니다.
3. 완료입니다. 이제 스크립트는 이 토큰을 옮길 때 마다 움직임을 추적할 것입니다.

### 준비3. 트리거 토큰 배치
![x](https://github.com/kibkibe/roll20-api-scripts/blob/master/wiki_image/ts/1_2.png)
1. 트리거로 사용할 토큰을 생성하고 **bar3**의 값을 `ts_trigger`로 설정합니다. (이름으로 설정하는 것이 아님에 주의하세요.)
2. 트리거 토큰의 GM 노트에 원하는 내용을 적습니다.
3. 완료입니다. 이제 스크립트는 마커 토큰이 어느 트리거 토큰 위에 올라갔느냐에 따라 메시지를 출력할 것입니다.

## 테스트&사용법
1. `ts_marker` 토큰을 움직여 트리거 토큰 위에 한번씩 올려봅니다.
2. 의도한대로 텍스트가 표시되는지 확인합니다.

## 옵션
![x](https://github.com/kibkibe/roll20-api-scripts/blob/master/wiki_image/ts/2_1.png)
GM 노트에 /desc, /as, /em 등의 명령어를 사용할 수 있습니다.  

![x](https://github.com/kibkibe/roll20-api-scripts/blob/master/wiki_image/ts/2_2.png)
각종 텍스트 서식을 입히거나 이미지를 삽입할 수도 있으며, narrator.js와 함께 사용할 수도 있습니다.  
단, GM 노트에 적용한 서식과 API 명령어가 채팅창에서도 모두 동일하게 동작하지는 않을 수 있으니 실제 사용 전에 테스트를 해서 제작의도대로 표시되는지를 확인하세요.

## 명령어
GM 노트의 내용에 `{{값이름}}`과 같은 형식으로 입력하면 변수값을 사용할 수 있습니다.  
값 이름은 임의로 정하시면 됩니다. 이 때 값 이름에 `:`, `{`, `}`는 포함될 수 없습니다.

      /desc {{round}}라운드 개시!
##### 결과
> **3라운드 개시!**
      
GM 노트에 `{{값이름:변겅되는 수치}}`와 같은 형식으로 입력하면 변수값을 변경할 수 있습니다.

      /desc {{round}}라운드 종료
      {{round:+1}}
      /desc {{round}}라운드 개시!
##### 결과
> **3라운드 종료**  
> **4라운드 개시!**


#### 주의사항
> 이 값들은 `ts_marker`의 GM 노트에 저장되는 내용입니다. 캐릭터시트와 연동되는 값이 아님에 주의해주세요.