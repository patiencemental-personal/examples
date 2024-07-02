import 'dart:async';

void main() {
  /**
   * 출력
   * 0
   * 1
   * 2
   * 3
   * 4
   */
  calculate(1).listen((val) {
    print('calculate(1): $val');
  });
}

Stream<int> calculate(int number) async* {
  for (int i = 0; i < 5; i++) {
    yield i * number;
  }
}
