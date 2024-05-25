import 'dart:async';

/**
 * 이번에 배우는 것
 * 두 개의 리스너가 동시에 실행되는 것 보단 하나의 리스너가 다 끝나고 다음 리스너가 실행되게 하는 것
 * 즉, Stream에서도 await하는 방법을 배움 - yield*
 * yield - 값을 순서대로 가져올 때 사용
 * yield* - 해당 스트림의 모든 값을 가져올 때 까지 기다림
 */

void main() {
  /**
   * 출력
   * [820] 0
   * [820] 1
   * [820] 2
   * [572] 0
   * [572] 1000
   * [572] 2000
   */
  playAllStream().listen((val) {
    print(val);
  });
}

Stream<String> playAllStream() async* {
  yield* calculate(DateTime.now().microsecond, 1);
  yield* calculate(DateTime.now().microsecond, 1000);
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
