// 이메일 주소 검사. 문의 폼과 뉴스레터 구독이 화면과 서버에서 같은 규칙을 쓴다.

// 이메일 주소의 최대 길이(RFC 5321).
const EMAIL_MAX_LENGTH = 254;
// 흔한 오타(골뱅이 빠짐, 도메인 점 빠짐, 공백)만 거른다. 실제로 받는 주소인지는 메일을 보내 봐야 안다.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const EMAIL_MESSAGE = "이메일 주소를 확인해주세요. 예) abcde@zaone.com";

export function isEmail(value: string): boolean {
  return value.length <= EMAIL_MAX_LENGTH && EMAIL_PATTERN.test(value);
}
