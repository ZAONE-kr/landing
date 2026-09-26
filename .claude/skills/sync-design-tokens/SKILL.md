---
name: sync-design-tokens
description: Figma 디자인 시스템의 Variables(색상·spacing·radius)나 텍스트 스타일이 바뀌어 코드의 디자인 토큰(src/app/globals.css)을 맞춰야 할 때 사용한다. 사용자가 "토큰 동기화", "Figma 변수 반영", "디자인 토큰 업데이트", "Figma랑 색상/타이포/간격 맞춰줘" 라고 하거나 /sync-design-tokens 를 부를 때 사용한다.
---

# 디자인 토큰 동기화

Figma가 원본이고 코드가 따라간다. **차이는 눈이 아니라 스크립트로 찾는다.**
스크립트가 `결과: 일치`를 내기 전에는 "완료"라고 보고하지 않는다.

## Figma 읽는 법

파일 키: `m84wh81FnzDSNKRJ0D7Nvw` (`https://www.figma.com/design/m84wh81FnzDSNKRJ0D7Nvw/Untitled`)

원격 Figma MCP(`plugin:figma`)의 **`use_figma`로 파일에 등록된 변수와 텍스트 스타일
전체를 받는다.** 데스크톱 앱에 파일을 열어 둘 필요는 없다.

- `use_figma` 도구가 없으면 `claude mcp list`로 `plugin:figma:figma` 상태를 본다.
  `Needs authentication`이면 사용자에게 `/mcp`로 인증하고 **세션을 다시 시작**해
  달라고 한다. MCP 도구 목록은 세션을 시작할 때만 읽는다.
- `get_variable_defs`로 비교하지 않는다. 선택한 노드에 적용된 변수만 돌려주고
  (spacing·radius와 새 색상이 통째로 빠졌었다), 자간 단위를 떼어 버린다(`-2%` → `-2`).
- Variables REST API는 Enterprise 플랜 전용이라 쓸 수 없다.

## 순서

1. **브랜치**: `main`이면 `chore/sync-design-tokens`를 판다.
2. **Figma 읽기**:
   1. `figma:figma-use` 스킬을 먼저 불러온다(`use_figma` 호출 전 필수).
   2. `scripts/dump-figma.js`를 Read해서 그 내용을 **그대로** `use_figma`의 `code`로
      넘긴다. `fileKey`는 위의 파일 키, `skillNames`는 `figma-use`. 읽기만 하는 코드다.
   3. 돌려받은 JSON을 **그대로** `/tmp/figma-tokens.json`에 Write로 저장한다. 값을
      정리하거나 반올림하지 않는다. 이전 파일이 있으면 먼저 Read해야 Write가 된다.
      **Write가 실패한 채로 3을 돌리면 옛 파일과 비교한다.**
3. **비교**:
   ```bash
   node .claude/skills/sync-design-tokens/scripts/check-tokens.mjs /tmp/figma-tokens.json
   ```
4. **반영**: 출력 섹션별로 처리한다.

   | 섹션                    | 대응                                                                                                      |
   | ----------------------- | --------------------------------------------------------------------------------------------------------- |
   | 값이 다름 / 코드에 없음 | 고치기 전에 그 값을 `use_figma` 원본 출력에서 다시 본다(옮겨 적다 틀렸을 수 있다). 맞으면 규칙대로 고친다 |
   | Figma에 없음            | **지우지 않는다.** 그 항목만 두고 나머지는 계속 고친다. 사용처 grep 결과와 함께 사용자에게 묻는다         |
   | 확인 필요               | 폰트 문제면 "폰트" 절을 따른다. 그 밖은 사용자에게 보고한다                                               |
   | Figma 쪽 정리 필요      | 코드는 스크립트가 제안한 이름으로 맞추고, 목록은 보고에 적어 디자이너에게 전달하게 한다                   |

   "Figma에 없음"은 파일 변수 목록에 없다는 뜻이다. 그래도 바로 지우지 않는다.
   삭제된 변수를 레이어가 아직 참조하고 있을 수 있고, 판단은 사용자가 한다.

   사용자가 답하면:
   - **지우라고 하면** 지우고 5의 사용처도 고친다.
   - **남기라고 하면** `keep-tokens.txt`에 날짜와 이유를 붙여 적는다. 사용자가
     남기라고 말한 토큰만 적는다. `결과: 일치`를 만들려고 스스로 적지 않는다.

5. **사용처**: 바뀐 토큰은 값만 바뀐 것까지 모두 grep한다. 앞의 `--color-`를 뗀
   이름으로 찾으면 유틸리티와 `var()`가 함께 걸린다.
   `grep -rn "bg-muted\|primitive-blue-500\|text-body-m-m\|spacing-md" src`
   이름이 바뀌거나 지워졌으면 사용처를 고치고, 값만 바뀌었으면 화면 영향으로 보고한다.
6. **재검사**: 3을 다시 돌리고 `pnpm format:check`, `pnpm lint`, `pnpm build`를 돌린다.
   확인 대기 항목이 있어도 돌린다.
7. **보고**: 바꾼 토큰(이전 값 → 새 값), 사용처, 사용자 판단을 기다리는 항목,
   디자이너에게 전달할 "Figma 쪽 정리 필요" 항목을 적는다. 판단을 기다리는 항목이
   있으면 "완료"가 아니라 **"확인 대기"**로 보고한다.
8. **커밋·PR**: 사용자가 요청하면 커밋하고 `create-pr` 스킬로 올린다. 확인 대기
   항목이 남아 있으면 커밋 전에 먼저 답을 받는다.

## 코드 규칙 (`src/app/globals.css`)

| Figma 컬렉션   | 코드                                                                                          |
| -------------- | --------------------------------------------------------------------------------------------- |
| Primitive 색상 | `:root`의 `--primitive-*`. hex 소문자. 유틸리티를 만들지 않는다                               |
| Semantic 색상  | `@theme static`의 `--color-*`. 값은 Figma가 참조하는 `var(--primitive-*)` — hex를 쓰지 않는다 |
| 텍스트 스타일  | `@theme`의 `--text-<스타일명 소문자>`와 `--line-height`, `--letter-spacing`, `--font-weight`  |
| Spacing        | `@theme`의 `--spacing-*`. rem(px ÷ 16), 0은 `0`                                               |
| Radius         | `@theme`의 `--radius-*`. rem(px ÷ 16), 0은 `0`, `radius-full`은 `9999px`                      |

- **이름**: Dev Mode code syntax가 있으면 그대로 쓴다. 없으면 Figma 이름에서 만든다
  (`/`와 `_`는 `-`로, 소문자. primitive는 `--primitive-`, semantic은 `--color-`, 숫자
  변수는 `--` + 이름). 스크립트가 제안하는 이름을 그대로 쓰고 임의로 바꾸지 않는다.
- **텍스트**: 크기는 rem, 행간은 단위 없는 값. 자간은 Figma 단위를 따른다 — px면
  px, %면 em(`-2%` → `-0.02em`, `-1.2%` → `-0.012em`). Figma의 float 오차
  (`1.2999999523162842`)는 반올림한다(px·행간은 소수 둘째 자리, em은 넷째 자리).
- `--color-*: initial;`, `--text-*: initial;`, `--radius-*: initial;`은 지우지 않는다.
  Tailwind 기본 팔레트·글자 크기·radius를 막는 줄이다. radius 기본값을 두면
  `rounded-2xl`(16px)이 `rounded-xl`(24px)보다 작아지고 `rounded-s`가 논리 속성
  유틸리티와 겹친다.
- spacing에는 `initial`을 두지 않는다. Tailwind 숫자 간격(`p-4`)도 함께 쓰기로 했다
  (2026-09-26 사용자 결정). 대신 `--spacing-md` 같은 이름이 `max-w-md` 같은 폭
  유틸리티를 가져가므로 컨테이너 폭은 `max-w-[28rem]`처럼 쓴다.
- 새 토큰은 같은 그룹(primitive는 색 계열, semantic은 bg/text/icon/border, 텍스트는
  heading/title/body/detail/display) 안에서 스크립트 출력 순서(= Figma 변수 패널
  순서)의 이웃 옆에 넣는다.
- Font-weight, Font-family 컬렉션(STRING)은 토큰으로 옮기지 않는다. 굵기는 텍스트
  토큰의 `--font-weight`가, 글꼴은 `layout.tsx`와 `--font-*`가 맡는다.

## 폰트

- Pretendard는 `pretendard` npm 패키지(가변 폰트)라서 굵기가 늘어도 할 일이 없다.
- Axiforma는 Book(300) 파일 하나만 `src/app/fonts/`에 있다. 다른 굵기가 필요하면
  **사용자에게 파일을 받는다.** 유료 폰트라 인터넷에서 받지 않는다. 받은 파일은
  `layout.tsx`의 `localFont` `src` 배열에 굵기와 함께 추가한다.
- Pretendard, Axiforma 외의 새 폰트가 나오면 멈추고 사용자에게 묻는다.

## 이미 확인된 사실

- Display-\*-B는 이름과 달리 Axiforma Book(300)이다. Figma 값을 따른다.
- `[Design System]` 페이지(`266:252`)의 가이드 프레임은 변수 전체를 보여 주지 않는다.
  Semantic Color Guide는 삭제된 `text/on-brand`를 아직 참조하고 있었다(2026-09-26).
- `--text-*`, `--spacing-*`, `--radius-*` 토큰은 쓰는 곳이 없으면 빌드 CSS에 나오지
  않는다. 빌드 결과가 아니라 스크립트로 확인한다.
