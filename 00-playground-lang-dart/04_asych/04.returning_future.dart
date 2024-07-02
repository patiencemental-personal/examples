void main() async {
  final sum1 = await addNumbers(1, 2);
  final sum2 = await addNumbers(1, 2);

  print('$sum1, $sum2'); // 3, 3
}

Future<int> addNumbers(int num1, int num2) async {
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
  return num1 + num2;
}
