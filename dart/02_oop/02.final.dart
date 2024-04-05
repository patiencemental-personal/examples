void main() {
  // 기본 생성자 사용
  Idol blackPink = Idol('블랙핑크', ['지수', '제니']);
  blackPink.sayHello();
  blackPink.introduce();

  /**
   * final로 선언됐기 때문에 에러 발생
   * final 키워드는 런타임에 값이 정해짐
   * 값이 정해지면 변경 불가능
   */
  blackPink.name = 'Good Member';
}

class Idol {
  final String name;
  final List<String> members;

  Idol(this.name, this.members);

  void sayHello() {
    print('안녕하세요 ${this.name}입니다.');
  }

  void introduce() {
    print('저희 멤버는 ${this.members}가 있습니다.');
  }
}
