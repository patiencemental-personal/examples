void main() {
  optionalParameterAddNumbers(10, 20, 30);
  optionalParameterAddNumbers(10);

  namedParameterAddNumbers(x: 10, y: 20, z: 30);
  namedParameterAddNumbers(x: 10, y: 20, z: 30, k: 50);

  print(getSum(x: 10, y: 20, z: 30, k: 50));

  positionalNamedOptionalParameterFn('positional',
      namedParam1: 'named-1',
      namedParam2: 'named-2',
      namedOptionalParam1: 'named-optional');
}

// positional parameter - 순서가 중요한 파라미터
// optional parameter - 있어도 되고 없어도 되는 파라미터
optionalParameterAddNumbers(int x, [int y = 0, int z = 0]) {
  int sum = x + y + z;
  print('총합 $sum');
}

// named parameter - 이름이 있는 파라미터 (순서가 중요하지 않음)
namedParameterAddNumbers({
  required int x, // named parameter
  required int y, // named parameter
  required int z, // named parameter
  int k = 0, // optional parameter
}) {
  int sum = x + y + z + k;
  print('총합 $sum');
}

// arrow function
int getSum({
  required int x, // named parameter
  required int y, // named parameter
  required int z, // named parameter
  int k = 0, // optional parameter
}) =>
    x + y + z + k;

/**
 * positional, named, optional parameter를 조합하여 구현한 함수 예제
 */
void positionalNamedOptionalParameterFn(String positionalParam1,
    {required String namedParam1,
    required String namedParam2,
    String namedOptionalParam1 = ''}) {
  return null;
}
