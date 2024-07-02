void main() {
  TimesTwo tt = TimesTwo(2);
  print(tt.calculate());

  TimewsFour tf = TimewsFour(2);
  print(tf.calculate());
}

class TimesTwo {
  final int number;

  TimesTwo(
    this.number,
  );

  int calculate() {
    // return number * 2; // 겹치는 값이 없다면 this 생략 가능
    return this.number * 2;
  }
}

class TimewsFour extends TimesTwo {
  TimewsFour(number) : super(number);

  @override
  int calculate() {
    // return this.number * 4; // 겹치는 값이 없다면 this 써도됨
    // return number * 4; // 겹치는 값이 없다면 this, super 생략 가능
    // return super.number * 4;
    return super.calculate() * 2; // super 써서 부모 메서드 호출 가능
  }
}
