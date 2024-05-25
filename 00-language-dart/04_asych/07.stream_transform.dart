import 'dart:async';

/**
 * Stream은 Dart 언어에서 기본으로 제공해주는 기능이 아니라서 다트 언어에서 제공해주는 패키지를 불러와서 사용해야함
 */

void main() {
  final controller = StreamController();
  final broadcastStream = controller.stream.asBroadcastStream();

  /**
   * where를 통해서 listen callback 실행 조건 설정 가능
   */

  final broadcastStreamListener1 =
      broadcastStream.where((val) => val % 2 == 0).listen((val) {
    print('Listener 1: $val');
  });
  final broadcastStreamListener2 =
      broadcastStream.where((val) => val % 2 == 1).listen((val) {
    print('Listener 2: $val');
  });

  /**
   * 출력
   * Listener 2: 1
   * Listener 1: 2
   * Listener 2: 3
   * Listener 1: 4
   */
  controller.sink.add(1); // 리스너한테 값을 전달
  controller.sink.add(2); // 리스너한테 값을 전달
  controller.sink.add(3); // 리스너한테 값을 전달
  controller.sink.add(4); // 리스너한테 값을 전달
}
