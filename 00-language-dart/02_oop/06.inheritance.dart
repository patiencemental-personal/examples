void main() {
  print('---------Idol---------');
  Idol apink = Idol(name: '에이핑크', membersCount: 5);
  apink.sayName();
  apink.sayMembersCount();

  print('---------Boy Group---------');
  BoyGroup bts = BoyGroup('BTS', 5);
  bts.sayName();
  bts.sayMembersCount();
  bts.sayMale();

  print('---------Girl Group---------');
  BoyGroup redVelvet = BoyGroup('Red Velvet', 5);
  redVelvet.sayName();
  redVelvet.sayMembersCount();

  print('---------Type Comparison---------');
  print(apink is Idol); // true
  print(apink is BoyGroup); // false
  print(apink is GirlGroup); // false

  print('---------Type Comparison 2---------');
  print(bts is Idol); // true
  print(bts is BoyGroup); // true
  print(bts is GirlGroup); // false
}

class Idol {
  String name;
  int membersCount;

  /**
   * Named Parameter 사용한 생성자
   */
  Idol({
    required this.name,
    required this.membersCount,
  });

  void sayName() {
    print('저는 ${this.name} 입니다.');
  }

  void sayMembersCount() {
    print('${this.name}은 ${this.membersCount}명의 멤버가 있습니다.');
  }
}

class BoyGroup extends Idol {
  BoyGroup(
    String name,
    int membersCount,
  ) : super(name: name, membersCount: membersCount);

  void sayMale() {
    print('저는 남돌입니다.');
  }
}

class GirlGroup extends Idol {
  GirlGroup(
    String name,
    int membersCount,
  ) : super(name: name, membersCount: membersCount);

  void sayMale() {
    print('저는 남돌입니다.');
  }
}
