/*
 * 제목으로 글 주소(slug)를 만든다. Sanity 기본 함수는 한글을 모두 지워서(한글 제목이면 빈 주소) 한글을 남기는 함수를
 * 따로 둔다. Studio 주소 필드의 Generate 버튼과 검사가 쓰고, 나중에 사이트에서 주소 모양을 확인할 때도 쓸 수 있다.
 * 다른 패키지를 불러오지 않아 양쪽에서 가볍고, node로 바로 돌려 볼 수 있다.
 */

// 주소 글자 수 상한(코드 포인트). 한글 한 글자는 주소창에서 %EA%B0%80처럼 9자로 늘어나 짧게 둔다.
export const SLUG_MAX_LENGTH = 60;

// 한글 입력기의 전각 모드로 친 영문·숫자·기호(Ａ, １ 등). 보통 글자로 바꿔야 같은 주소가 두 모양으로 생기지 않는다.
const FULLWIDTH = /[！-～]/g;
// 지울 글자: 결합 부호, 보이지 않는 서식 문자(너비 없는 공백 등), 따옴표, 홑낫표·겹낫표·꺾쇠.
// 따옴표를 하이픈으로 바꾸면 “놀이”로 → 놀이-로처럼 조사가 떨어져 나가서 지운다.
const REMOVED = /[\p{M}\p{Cf}\p{Pi}\p{Pf}'"`〈-』]/gu;
// 글자(한글·영문 등)도 숫자도 아닌 것이 이어진 곳. 하이픈 하나로 바꾼다.
const SEPARATORS = /[^\p{L}\p{N}]+/gu;

/*
 * 주소 모양으로 고친 값(길이는 자르지 않는다). 나뉜 한글 자모(macOS에서 붙여 넣은 글)를 합치고, 영문은 소문자로,
 * 공백·기호는 하이픈 하나로 바꾸고, 앞뒤 하이픈을 지운다. 글자·숫자가 하나도 없으면 ""다.
 * 마지막에 한 번 더 합치는 것은 지운 글자 양옆의 자모가 붙는 경우에도 두 번 돌린 값이 같게 하려는 것이다.
 */
export function normalizeSlug(input: string): string {
  return input
    .normalize("NFC")
    .replace(FULLWIDTH, (char) => String.fromCharCode(char.charCodeAt(0) - 0xfee0))
    .toLowerCase()
    .replace(REMOVED, "")
    .replace(SEPARATORS, "-")
    .replace(/^-+|-+$/g, "")
    .normalize("NFC");
}

/*
 * Generate 버튼이 만드는 주소. 길면 maxLength자 안에서 마지막 낱말 경계(하이픈)까지만 남기고, 낱말 하나가 그보다 길면
 * 그 자리에서 자른다. 글자는 코드 포인트로 센다. .slice()는 일부 한자를 반으로 갈라 주소를 깨뜨린다.
 */
export function slugify(input: string, maxLength = SLUG_MAX_LENGTH): string {
  const chars = Array.from(normalizeSlug(input));
  if (chars.length <= maxLength) return chars.join("");
  const cut = chars.slice(0, maxLength).join("");
  if (chars[maxLength] === "-") return cut;
  const lastHyphen = cut.lastIndexOf("-");
  return lastHyphen > 0 ? cut.slice(0, lastHyphen) : cut;
}
