void main() {
  Lecture<String> lecture1 = Lecture('p1001');
  lecture1.printIdType();

  Lecture<int> lecture2 = Lecture(1001);
  lecture2.printIdType();
}

// generic - 타입을 외부에서 받을 때 사용
class Lecture<T> {
  final T id; // Lecture 클래스를 사용하는 곳에서 타입을 정의함 -> id의 타입이 정해짐

  Lecture(this.id);

  void printIdType() {
    print(id.runtimeType);
  }
}
