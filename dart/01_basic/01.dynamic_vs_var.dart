void main() {
  dynamic dynamicName = '코드팩토리';
  print(dynamicName); // 코드팩토리

  var varName = '블랙핑크';
  print(varName); // 블랙핑크

  print(dynamicName.runtimeType); // String
  print(varName.runtimeType); // String

  dynamicName = 2; // no error
  varName = 2; // error

  /**
   * var vs dynamic
   * var - 한 번 타입이 정해지면 타입 변경 불가능
   * dynamic - 한 번 타입이 정해져도 다른 타입으로 변경 가능
   */
}
