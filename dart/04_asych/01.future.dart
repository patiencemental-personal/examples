void main() {
  // Future - 미래
  // 미래에 받아올 값
  Future<String> name = Future.value('코드팩토리');
  Future<int> number = Future.value(5);

  /**
   * 출력
   * 계산 시작: 1 + 2
   * 함수 완료
   * 계산 완료: 3
   */
  addNumbers(1, 2);
}

void addNumbers(int num1, int num2) {
  print('계산 시작: $num1 + $num2');

  Future.delayed(Duration(seconds: 2), () {
    print('계산 완료: ${num1 + num2}');
  });

  print('함수 완료');
}
