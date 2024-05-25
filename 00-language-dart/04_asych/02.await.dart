void main() {
  /**
   * 출력
   * [638] 계산 시작: 1 + 2
   * [636] 계산 시작: 1 + 2
   * [638] 계산 완료: 3
   * [638] 함수 완료
   * [636] 계산 완료: 3
   * [636] 함수 완료
   */
  addNumbers(1, 2);
  addNumbers(1, 2);
}

void addNumbers(int num1, int num2) async {
  final id = DateTime.now().microsecond;
  print('[$id] 계산 시작: $num1 + $num2');

  /**
   * await를 해도 CPU가 기다리는게 아님!
   * await을 하는 동안 CPU는 다른 작업을 한다!!
   */
  await Future.delayed(Duration(seconds: 2), () {
    print('[$id] 계산 완료: ${num1 + num2}');
  });

  print('[$id] 함수 완료');
}
