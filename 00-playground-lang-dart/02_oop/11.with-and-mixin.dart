/**
 * @see https://fomaios.tistory.com/entry/Dart-Mixin%EC%9D%B4%EB%9E%80-featwith
 */
/**
 * @description mixin
 * Dart 언어에서 with 키워드는 믹스인(Mixin)을 사용하여 클래스에 기능을 추가하는 데 사용됨
 * Mixin은 다중 상속을 제공하는 방법 중 하나 - 여러 클래스에서 재사용될 수 있는 메소드 집합을 정의할 수 있게 해줌
 * Dart에서는 상속을 통한 코드 재사용 외에도 믹스인을 통해 유연성과 코드 재사용성을 더욱 강화할 수 있음
 * 
 * Mixin 특징
 * - 재사용성: 믹스인을 통해 클래스에 메소드나 속성을 추가할 수 있어, 코드를 여러 곳에서 재사용
 * - 다중 상속: Dart는 기본적으로 단일 상속만을 지원하지만, 믹스인을 사용하여 여러 클래스의 기능을 한 클래스에 결합 가능
 * - 타입 안정성: 믹스인은 타입 체계 내에서 작동하므로, Dart의 정적 타입 체크의 이점을 그대로 활용 가능
 * 
 * 주의 사항
 * - 충돌: 둘 이상의 믹스인이 동일한 메소드를 정의할 경우, 사용된 순서에 따라 마지막에 명시된 믹스인의 메소드가 우선적으로 사용됨
 * - 제약 조건: 믹스인을 적용할 때는 상속받는 클래스나 믹스인이 특정 조건을 만족해야 할 수도 있습니다. 예를 들어, 믹스인 내부에서 사용되는 메소드나 필드가 기본 클래스에 존재해야 할 수 있습니다.
 */
void main() {
  final button = Button();
  button.press();
}

mixin Clickable {
  void click() => print("Clicked!");
}

mixin Tappable {
  void tap() => print("Tapped!");
}

class Button with Clickable, Tappable {
  void press() {
    // super.click();
    // super.tap();
    click();
    tap();
  }
}
