void main() {
  Idol blackPink = Idol('블랙핑크', ['지수', '제니']);

  print(blackPink.firstMember); // getter 사용
  blackPink.firstMember = '예림'; // setter 사용
  print(blackPink.firstMember); // getter 사용
}

class Idol {
  String name;
  List<String> members;

  Idol(this.name, this.members);

  void sayHello() {
    print('안녕하세요 ${this.name}입니다.');
  }

  void introduce() {
    print('저희 멤버는 ${this.members}가 있습니다.');
  }

  /**
   * getter
   * - 함수와의 차이점 - 간단한 데이터 조회 및 가공하여 조회할 때 사용
   */
  String get firstMember {
    return this.members[0];
  }

  /**
   * setter
   * - 무조건 한 개의 파라미터만 넣을 수 있다
   */
  set firstMember(String member) {
    this.members[0] = member;
  }
}
