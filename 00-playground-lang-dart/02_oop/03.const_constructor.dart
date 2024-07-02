void main() {
  // const constructor 사용
  Idol blackPink = const Idol('블랙핑크', ['지수', '제니']);
  blackPink.sayHello();
  blackPink.introduce();

  /**
   * Error 발생
   * 이유는 const constructor를 사용했는데 런타임에 값이 정해지는 DateTime.now()를 사용해서 파라미터를 넘겼기 때문이다
   */
  // Idol blackPink2 = const Idol(DateTime.now().toString(), ['지수', '제니']);

  Idol blackPink2 = const Idol('블랙핑크', ['지수', '제니']);
  Idol blackPink3 = Idol('블랙핑크', ['지수', '제니']);

  print(blackPink == blackPink2); // true, 둘 다 const constructor를 사용했기 때문
  print(
      blackPink == blackPink3); // false, blackPink3은 const constructor를 사용하지 않음
}

class Idol {
  final String name;
  final List<String> members;

/**
 * const constructor
 * const로 생성자 사용 가능
 * const는 한 번 선언하고 나면 변경 불가능
 * const를 사용하면 빌드 타임에 값을 알 수 있어야 한다 
 */
  const Idol(this.name, this.members);

  void sayHello() {
    print('안녕하세요 ${this.name}입니다.');
  }

  void introduce() {
    print('저희 멤버는 ${this.members}가 있습니다.');
  }
}
