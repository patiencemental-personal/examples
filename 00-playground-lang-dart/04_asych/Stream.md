- stream도 async 프로그래멩에서 사용하는 기술 중 하나

- Future는 한 함수에서 하나의 값만 받아낼 수 있음
  ![Alt text](image.png)

- 여러 순간에 여러 번 값을 받아낼 수 있도록 하는 것이 Stream
  ![Alt text](image-1.png)
  - yield 키워드를 사용해서 값을 지속적으로 받을 수 있음
  - 언제까지? 스트림을 닫을때까지!
