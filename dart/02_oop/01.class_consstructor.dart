void main() {
  // 기본 생성자 사용
  Idol blackPink = Idol('블랙핑크', ['지수', '제니']);
  blackPink.sayHello();
  blackPink.introduce();

  // Named 생성자 사용
  Idol bts = Idol.fromList([
    ['진', '슈가'],
    'BTS',
  ]);
  bts.sayHello();
  bts.introduce();
}

class Idol {
  String name;
  List<String> members;

  /**
   * 기본 생성자 1
   */
  // Idol(String name, List<String> members)
  //     : this.name = name,
  //       this.members = members;

  /**
   * 기본 생성자 2
   */
  Idol(this.name, this.members);

  /**
   * Named 생성자
   */
  Idol.fromList(List values)
      : this.members = values[0],
        this.name = values[1];

  void sayHello() {
    print('안녕하세요 ${this.name}입니다.');
  }

  void introduce() {
    print('저희 멤버는 ${this.members}가 있습니다.');
  }
}
