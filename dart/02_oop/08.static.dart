void main() {
  Employee sangwon = Employee('상원');
  Employee hyomin = Employee('효민');

  sangwon.printNameAndBuilding(); // 제 이름은 상원 입니다. null 건물에서 근무하고 있습니다.
  hyomin.printNameAndBuilding(); // 제 이름은 효민 입니다. null 건물에서 근무하고 있습니다.

  Employee.building = '효남빌딩';

  sangwon.printNameAndBuilding(); // 제 이름은 상원 입니다. 효남빌딩 건물에서 근무하고 있습니다.
  hyomin.printNameAndBuilding(); // 제 이름은 효민 입니다. 효남빌딩 건물에서 근무하고 있습니다.

  Employee.printBuilding(); // 저는 효남빌딩 건물에서 근무중 입니다.
}

class Employee {
  // static 필드 혹은 메서드는 instance에 귀속되지 않고 class에 귀속됨
  static String? building;

  final String name;

  Employee(this.name);

  void printNameAndBuilding() {
    print('제 이름은 $name 입니다. $building 건물에서 근무하고 있습니다.');
  }

  static void printBuilding() {
    print('저는 $building 건물에서 근무중 입니다.');
  }
}
