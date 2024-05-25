void main() {
  // Record Destructuring
  final minJi = ('민지', 20);
  final (name, age) = minJi;
  print(name); // 민지
  print(age); // 20

  // Array Desctructring
  final newJeans = ['민지', '해린'];
  final [a, b] = newJeans;
  final [String typeA, String typeB] = newJeans;
  print('$a $b $typeA $typeB'); // 민지 해린 민지 해린

  // rest 키워드
  final numbers = [1, 2, 3, 4, 5, 6, 7, 8];
  final [x, y, ..., z] = numbers; // rest 키워드는 배열 안에서 한 번만 쓸 수 있다
  print('$x, $y, $z'); // 1, 2, 8

  // rest에 이름 붙여주기
  final [xx, yy, ...rest, zz] = numbers; // rest 키워드는 배열 안에서 한 번만 쓸 수 있다
  print('$xx, $yy, $zz'); // 1, 2, 8
  print(rest); // [3, 4, 5, 6, 7]

  // ignore '_'
  final [xxx, _, yyy, _, ...rest2, zzz, _] = numbers;
  print('$xxx, $yyy, $rest2, $zzz'); // 1, 3, [5, 6], 7

  // Map Desctructring
  final minJiMap = {'name': '민지', 'age': 19};
  final {'name': name3, 'age': age3} = minJiMap;
  print('$name3, $age3'); // 민지, 19

  // Class Desctructring
  final minJiIdol = Idol(name: '민지', age: 19);
  final Idol(name: name4, age: age4) = minJiIdol;
  print('$name4, $age4'); // 민지, 19

  /**
   * 이것들 말고도 많음
   * 어떤 구조든 똑같이 패턴은 맞춰주기만 하면 Desctructring이 가능
   */
}

class Idol {
  final String name;
  final int age;

  Idol({
    required this.name,
    required this.age,
  });
}
