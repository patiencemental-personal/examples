# [15개 프로젝트로 실무까지 끝내는 Dart & Flutter 앱 개발](https://fastcampus.co.kr/dev_online_dartflutter)

## Part 4. 심화

Chapter 4. 아키텍처
- 챕터 3에서 배운 아키텍처 개념을 실제로 적용해보는 챕터입니다.
- To do 앱 GetX Isar, dio 버전

https://github.com/fastcampus-flutter/part3_chapter5_todo_state_management

**branch : storage_repo/getX_isar_dio**

### 주의

- 개발에 정답은 없습니다.
  - 클린아키텍처 방식은 다양합니다.
- 아키텍처 적용이 처음이라면 어려울 수 있습니다.
  - 완전 초보자 대상 강의가 아니에요.
  - 한번에 이해 못하는게 당연해요.
- IDE replace 활용

### 학습 순서

1. 최대한 이해해보려고 노력하면서 강의 내용 다 보기.
   - 클린아키텍처 적용된 샘플 프로젝트 분석
2. 원칙들을 학습하고 이해하면서 직접 해보기.
   - 기존 프로젝트부터 처음부터 적용
3. 직접 해본 프로젝트와 현재 프로젝트 비교해보기.
4. 장단점에 대해서 여러 고민해보고 여러분만의 아키텍처 만들기.

### 적용 순서

1. 아키텍처에 맞게 프로젝트 폴더링
   - presentation
   - data
   - domain
2. presentation
   - presenter
3. data
   - entity
   - source(remote, local)
   - repository
4. domain
   - model
   - repository
   - use case
5. DI

### +@

- entity(dto, db model) / model 통합
- use case 사용 안하고 repository만 활용
- Layer 단위로 패키지 모듈화
   - https://github.com/invertase/melos 활용 추천 