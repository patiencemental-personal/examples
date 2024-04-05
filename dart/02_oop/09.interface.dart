void main() {
  BoyGroup bts = BoyGroup('BTS');
  GirlGroup redVelvet = GirlGroup('redVelvet');

  bts.sayName();
  redVelvet.sayName();

  // IdolInterface a = IdolInterface('a'); // error!

  print(bts is IdolInterface); // true
  print(bts is BoyGroup); // true
  print(bts is GirlGroup); // false
}

/**
 * interface
 * dart는 class 키워드로 interface 선언 가능
 * 모든 클래스가 암묵적으로 인터페이스를 정의합니다. 그리므로, 모든 클래스를 implement 할 수 있습니다.
 * 
 * 다만 인터페이스를 정의할 때 그냥 class 키워드만 사용하면 누군가 실수로 인터페이스로 인스턴스를 만들 수도 있음
 * 그러므로 abstract 키워드를 사용해서 추상 클래스라는 것을 명시 -> 인스턴스로 만들지 못함
 */
// class IdolInterface {
abstract class IdolInterface {
  String name;

  IdolInterface(this.name);

  void sayName() {}
}

/**
 * 인터페이스를 구현한 클래스
 */
class BoyGroup implements IdolInterface {
  String name;

  BoyGroup(this.name);

  void sayName() {
    print('제 이름은 $name 입니다.');
  }
}

/**
 * 인터페이스를 구현한 클래스
 */
class GirlGroup implements IdolInterface {
  String name;

  GirlGroup(this.name);

  void sayName() {
    print('제 이름은 $name 입니다.');
  }
}
