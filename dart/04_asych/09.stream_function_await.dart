import 'dart:async';

void main() {
  /**
   * 출력 - 두 listener가 동시에 실행됨
   * [811] 0
   * [549] 0
   * [811] 1
   * [549] 4
   * [811] 2
   * [549] 8
   */
  calculate(DateTime.now().microsecond, 1).listen((val) {
    print(val);
  });
  calculate(DateTime.now().microsecond, 4).listen((val) {
    print(val);
  });
}

/**
 * async함수를 async*에서 사용하는 방법을 알아보자
 * async* 이여도 일반 async를 쓰는 것처럼 await를 쓸 수 있다
 */
Stream<String> calculate(int id, int number) async* {
  for (int i = 0; i < 3; i++) {
    yield '[$id] ${i * number}';
    await Future.delayed(Duration(seconds: 1));
  }
}
