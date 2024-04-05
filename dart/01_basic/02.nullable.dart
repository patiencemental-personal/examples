void main() {
  // nullable - null이 될 수 있음
  // non-nullable - null이 될 수 없음
  // null

  String nonNullableName = '코드팩토리';
  nonNullableName = null; // error

  String? nullableName = '코드팩토리';
  nullableName = null;

  print(nullableName!); // ! - 절대 null이 아님을 개발자가 명시적으로 나타냄
}
