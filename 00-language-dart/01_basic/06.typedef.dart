void main() {
  Operation operation = add;
  int result = operation(10, 20, 30);
  print(result);

  operation = subtract;
  int result2 = operation(10, 20, 30);
  print(result2);

  int result3 = calculate(10, 20, 30, subtract);
  print(result3);

  EnhancedInteger enhancedInteger = 5;
  print(enhancedInteger);
}

// signature
typedef Operation = int Function(int x, int y, int z);
typedef EnhancedInteger = int;

// 더하기
int add(int x, int y, int z) => x + y + z;

// 빼기
int subtract(int x, int y, int z) => x - y - z;

// 계산
int calculate(int x, int y, int z, Operation operation) {
  return operation(x, y, z);
}
