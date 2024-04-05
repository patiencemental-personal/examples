void main() async {
  /**
   * 출력
   * [417] 계산 시작: 1 + 2
   * [417] 계산 완료: 3
   * [417] 함수 완료
   * [94] 계산 시작: 1 + 2
   * [94] 계산 완료: 3
   * [94] 함수 완료
   */
  /**
   * <항상 생각할 점>
   * 여기서도 await을 하는 동안 다른 함수를 실행할 기회가 온다면 CPU가 실행 한다!!
   */
  await addNumbers(1, 2);
  await addNumbers(1, 2);
}

Future<void> addNumbers(int num1, int num2) async {
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
