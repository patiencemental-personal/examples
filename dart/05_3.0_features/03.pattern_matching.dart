void main() {
  // validation
  // 타입 캐스팅을 잘못할 경우 빌드 타임에 에러가 날 수 있게 설정 가능

  final minJi = ('민지', 20);
  final (name as String, age as int) = minJi;
  print('$name, $age'); // 민지, 20

  // switcher('aaa'); // match: aaa
  // switcher('bbb'); // no match
  switcher(['1', '2']); // match: [1, 2]
  switcher([1, 2, 3]); // match: [_, _, _]
  switcher([4, '5', '6']); // match: [_, _, _]
  switcher([6, 9]); // match: [int 6, int 9]
  switcher(7); // match: < 10 && > 5

  print(switcher2(5, false)); // match: 5
  print(switcher2(4, false)); // no match
  print(switcher2('5', false)); // no match
  print(switcher2(7, true)); // match 7 and true
  print(switcher2(7, false)); // no match

  /**
   * 민지, 20
   * 해린, 19
   * -------------
   * 민지, 20
   * 해린, 19
   */
  forLooper();

  ifMatcher(); // 민지, 20
}

void switcher(dynamic anything) {
  switch (anything) {
    case 'aaa':
      print('match: aaa');
    case ['1', '2']:
      print('match: [1, 2]');
    case [_, _, _]: // 3개의 값이 들어가 있는 어떤 리스트든 된다는 의미
      print('match: [_, _, _]');
    case [int a, int b]:
      print('match: [int $a, int $b]');
    case < 10 && > 5:
      print('match: < 10 && > 5');
    default:
      print('no match');
  }
}

/**
 * 새로운 swtich 문법
 */
String switcher2(dynamic val, bool condi) => switch (val) {
      5 => 'match: 5',
      // 7이라는 값이 들어왔을 때 무언가 조건을 더 넣고 싶은 경우 when 키워드 사용
      7 when condi => 'match 7 and true',
      _ => 'no match', // default
    };

void forLooper() {
  final List<Map<String, dynamic>> members = [
    {
      'name': '민지',
      'age': 20,
    },
    {
      'name': '해린',
      'age': 19,
    }
  ];

  for (final member in members) {
    print('${member['name']}, ${member['age']}');
  }

  print('-------------');

  for (var {'name': name, 'age': age} in members) {
    print('${name}, ${age}');
  }
}

/**
 * if 문 안에서 minji 객체의 구조를 validation 하면서 desctructring 하고 싶은 경우
 */
void ifMatcher() {
  final minji = {
    'name': '민지',
    'age': 20,
  };

  if (minji case {'name': String name, 'age': int age}) {
    print('${name}, ${age}');
  }
}
