/**
 * private(클래스, 함수, 필드 등)로 변경하고 싶다면 '_' 를 붙여주면 됨
 */

void main() {
  _Idol blackPink = _Idol('블랙핑크', ['지수', '제니']);

  print(blackPink._firstMember);

  print(blackPink._name);
}

class _Idol {
  String _name;
  List<String> _members;

  _Idol(this._name, this._members);

  void _sayHello() {
    print('안녕하세요 ${this._name}입니다.');
  }

  void _introduce() {
    print('저희 멤버는 ${this._members}가 있습니다.');
  }

  String get _firstMember {
    return this._members[0];
  }
}
