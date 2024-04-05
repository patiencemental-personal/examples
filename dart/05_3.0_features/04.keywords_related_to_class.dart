// 문서로 다시 확인해봐야함
// 강의에서 제대로 된 내용 안보여줌

void main() {}

/**
 * final로 클래스를 선언 -> 다른 파일에서 extends, implement, mixin으로 사용 불가능 (같은 파일에서는 가능하다)
 * 다만 final or base or sealed 키워드로 class를 정의해야 함
 */
final class Person {
  final String name;
  final int age;

  Person({
    required this.name,
    required this.age,
  });
}

final class Idol extends Person {
  Idol(String name, int age) : super(name: name, age: age);
}

base class Idol2 extends Person {
  Idol2(String name, int age) : super(name: name, age: age);
}

sealed class Idol3 extends Person {
  Idol3(String name, int age) : super(name: name, age: age);
}

/**
 * base 클래스 -> extend는 가능, implement 는 불가능
 * 좋은 이유
 *  - dart는 extend 가능한 타입과 implement 가능한 타입이 안나눠져 있었음
 *  - 이걸 base를 사용하면 명시적으로 extend만 가능하다는 것을 알 수 있음
 */
base class BasePerson {
  final String name;
  final int age;

  BasePerson({
    required this.name,
    required this.age,
  });
}

/**
 * base, sealed, final로 선언된 클래스만 extend 가능
 */
base class BaseClass {}

sealed class SealedClass {}

final class FinalClass {}

base class ExtendBaseClass extends BaseClass {} // final, selaed 키워드도 가능

/**
 * interface로 선언 => implement만 가능하다
 */
interface class InterfacePerson {}

class InterfaceIdol implements InterfacePerson {}

/**
 * base, sealed, fina, interface 키워드로 선언된 클래스를 다른 파일에서 불러올 수 없음
 */

/**
 * sealed 클래스 - abstract + final
 * 
 * 패턴 매칭할 수 있도록 해줌
 * 
 */
sealed class SealedPerson {}

class SealedIdol extends SealedPerson {}

class SealedEngineer extends SealedPerson {}

class SealedChef extends SealedPerson {}

/**
 * sealed 클래스 관련
 * switch 문 에러
 *   The type 'SealedPerson' is not exhaustively matched by the switch cases since it doesn't match 'SealedChef()'. 
 *   Try adding a wildcard pattern or cases that match 'SealedChef()'.
 * 
 * 에러 발생 이유
 *   SealedChef라는 클래스의 인스턴스가 될 가능성이 있음에도 switch 문에서 SealedChef를 체크하지 않고 default case문도 넣지 않았기 때문에
 *   SealedChef가 입력이 됐을 때 실제로 값들이 다 패턴 매칭이 됐는지 확인할 길이 없다는 것임
 * 
 * 해결 방법
 *   SealedChef case를 넣든가 defualt case를 넣어야 함
 */
String whoIsHe(SealedPerson person) => switch (person) {
      SealedIdol i => 'idol',
      SealedEngineer e => 'engineer',
    };

/**
 * mixin class
 * 1) mixin은 extends나 with를 사용할 수 없다 => mixin class도 마찬가지로 extends나 with를 사용할 수 없다
 * 2) 클래스는 on 키워드를 사용할 수 없다 -> mixin class도 on 키워드를 사용할 수 업다
 */
mixin class AnimalMixin {
  String bark() {
    return '멍멍';
  }
}

class Dog with AnimalMixin {}
