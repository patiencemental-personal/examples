/**
 * enum을 사용하는 이유
 * - 정확히 이 3개의 값 밖에 존재하지 않는단 것을 명시하기 위함
 */
enum Status {
  approved, // 승인
  pending, // 대기
  rejected, // 거절
}

void main() {
  Status status = Status.pending;

  if (status == Status.approved) {
    print('승인. $status');
  } else if (status == Status.pending) {
    print('대기. $status');
  } else {
    print('거절. $status');
  }
}
