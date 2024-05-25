void main() {
  final result = nameAndAge({
    'name': '민지',
    'age': 20,
  });

  print(result); // (민지, 20)
  print(result.$1); // 민지
  print(result.$2); // 20
  print(result.$1.runtimeType); // String
  print(result.$2.runtimeType); // int

  final result3 = getNewJeansWithType();
  for (final item in result3) {
    print(item.$1);
    print(item.$2);
  }

  final result4 = getNewJeansWithType2();
  for (final item in result4) {
    print(item.$1);
    print(item.$2);
  }

  final result5 = getNewJeansWithType3();
  for (final item in result5) {
    // print(item.$1); // error
    // print(item.$2); // error
    print(item.name);
    print(item.age);
  }
}

// Record - 순서와 타입을 동시에 보장해주고 싶을 때 사용
(String, dynamic) nameAndAge(Map<String, dynamic> json) {
  return (json['name'] as String, json['age'] as int);
}

List<Map<String, dynamic>> getNewJeans() {
  return [
    {
      'name': '민지',
      'age': 20,
    },
    {
      'name': '해린',
      'age': 18,
    }
  ];
}

List<(String, int)> getNewJeansWithType() {
  return [
    ('민지', 20),
    ('해린', 18),
  ];
}

// Record의 각 요소에 이름을 정해줘서 좀 더 가독성있게 사용
List<(String name, int age)> getNewJeansWithType2() {
  return [
    ('민지', 20),
    ('해린', 18),
  ];
}

// Record의 각 요소에 이름을 정해줘서 좀 더 가독성있게 사용 + Record('()')를 '{}'로 감싸서 named parameter 적용
List<({String name, int age})> getNewJeansWithType3() {
  return [
    (name: '민지', age: 20),
    (name: '해린', age: 18),
  ];
}
