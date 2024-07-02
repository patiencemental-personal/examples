import 'dart:async';

/**
 * Stream은 Dart 언어에서 기본으로 제공해주는 기능이 아니라서 다트 언어에서 제공해주는 패키지를 불러와서 사용해야함
 */

void main() {
  final controller = StreamController();
  // final stream = controller.stream; // 한 번만 listen할 수 있는 stream 생성
  final broadcastStream =
      controller.stream.asBroadcastStream(); // 여러번 listen할 수 있는 stream 생성

  final broadcastStreamListener1 = broadcastStream.listen((val) {
    print('Listener 1: $val');
  });
  final broadcastStreamListener2 = broadcastStream.listen((val) {
    print('Listener 2: $val');
  });

  /**
   * 출력
   * Listener 1: 1
   * Listener 2: 1
   * Listener 1: 2
   * Listener 2: 2
   * Listener 1: 3
   * Listener 2: 3
   * Listener 1: 4
   * Listener 2: 4
   */
  controller.sink.add(1); // 리스너한테 값을 전달
  controller.sink.add(2); // 리스너한테 값을 전달
  controller.sink.add(3); // 리스너한테 값을 전달
  controller.sink.add(4); // 리스너한테 값을 전달
}
