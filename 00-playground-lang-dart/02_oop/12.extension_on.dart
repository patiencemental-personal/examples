import 'dart:async';

/**
 * extension {확장 이름} on {타입}
 * 특정 타입에 대해 새로운 메서드나 계산된 속성을 추가할 수 있는 기능을 제공
 * 기존 라이브러리나 프레임워크의 클래스를 수정하지 않고도 해당 클래스의 기능을 확장 가능
 */

extension AsyncString on String {
  Timer delay(Function func,
      [Duration duration = const Duration(milliseconds: 50)]) {
    return Timer(duration, () {
      // 지연 후 함수 실행
      func();
    });
  }
}

void main() {
  'example'
      .delay(() => print('example Hello World'), Duration(milliseconds: 2500));
}
