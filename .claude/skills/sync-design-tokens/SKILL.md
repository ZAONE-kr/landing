---
name: sync-design-tokens
description: Figma 디자인 시스템의 Variables(색상)나 텍스트 스타일이 바뀌어 코드의 디자인 토큰(src/app/globals.css)을 맞춰야 할 때 사용한다. 사용자가 "토큰 동기화", "Figma 변수 반영", "디자인 토큰 업데이트", "Figma랑 색상/타이포 맞춰줘" 라고 하거나 /sync-design-tokens 를 부를 때 사용한다.
---

# 디자인 토큰 동기화

Figma가 원본이고 코드가 따라간다. **차이는 눈이 아니라 스크립트로 찾는다.**
스크립트가 `결과: 일치`를 내기 전에는 "완료"라고 보고하지 않는다.

## Figma 위치

파일: `https://www.figma.com/design/m84wh81FnzDSNKRJ0D7Nvw/Untitled` — Figma **데스크톱
앱에 이 파일이 열려 있어야** `mcp__figma__*` 도구가 읽을 수 있다.

| 노드      | 내용                                                                     |
| --------- | ------------------------------------------------------------------------ |
| `266:252` | `[Design System]` 페이지 전체. 비교 기준은 이것 하나                     |
| `284:2`   | Primitive Color Guide 프레임                                             |
| `288:2`   | Semantic Color Guide 프레임 (semantic → primitive 참조 경로가 적혀 있다) |

페이지를 처음부터 탐색하지 않는다. `get_variable_defs 266:252` 한 번이면 색상과
텍스트 스타일이 모두 나온다. 이 결과에는 semantic이 어느 primitive를 참조하는지가
없어서, 스크립트가 hex가 같은 primitive를 참조로 제안한다. 후보가 여럿이라 하나로
못 정할 때만 `288:2` 스크린샷으로 확인한다.

## 순서

1. **브랜치**: `main`이면 `chore/sync-design-tokens`를 판다.
2. **Figma 읽기**: `get_variable_defs`(nodeId `266:252`) 결과 JSON을 **그대로**
   `/tmp/figma-vars.json`에 Write로 저장한다(이전 파일이 있으면 덮어쓴다). 값을
   정리하거나 반올림하지 않는다.
3. **비교**:
   ```bash
   node .claude/skills/sync-design-tokens/scripts/check-tokens.mjs /tmp/figma-vars.json
   ```
4. **반영**: 출력 섹션별로 처리한다.

   | 섹션                    | 대응                                                                                                    |
   | ----------------------- | ------------------------------------------------------------------------------------------------------- |
   | 값이 다름 / 코드에 없음 | 고치기 전에 그 값을 MCP 원본 출력에서 다시 본다 (옮겨 적다 틀렸을 수 있다). 맞으면 아래 규칙대로 고친다 |
   | Figma 결과에 없음       | **지우지 않는다.** 그 항목만 두고 나머지는 계속 고친다. 사용처 grep 결과와 함께 사용자에게 묻는다       |
   | 확인 필요               | 폰트 문제면 "폰트" 절을 따른다. 그 밖은 사용자에게 보고한다                                             |

   "Figma 결과에 없음"을 바로 지우면 안 되는 이유: `get_variable_defs`는 **페이지에
   적용된 변수만** 돌려준다. 결과에 없다고 Figma에서 삭제됐다는 뜻이 아니다.
   가이드 프레임에 없다는 것도 삭제의 근거가 되지 않는다. 판단은 사용자가 한다.

   사용자가 답하면:
   - **지우라고 하면** 지우고 5의 사용처도 고친다.
   - **남기라고 하면** `keep-tokens.txt`에 날짜와 이유를 붙여 적는다. 사용자가
     남기라고 말한 토큰만 적는다. `결과: 일치`를 만들려고 스스로 적지 않는다.

5. **사용처**: 바뀐 토큰은 값만 바뀐 것까지 모두 grep한다. 앞의 `--color-`를 뗀
   이름으로 찾으면 유틸리티와 `var()`가 함께 걸린다.
   `grep -rn "bg-muted\|primitive-blue-500\|text-body-m-m" src`
   이름이 바뀌거나 지워졌으면 사용처를 고치고, 값만 바뀌었으면 화면 영향으로 보고한다.
6. **재검사**: 3을 다시 돌리고 `pnpm format:check`, `pnpm lint`, `pnpm build`를 돌린다.
   확인 대기 항목이 있어도 돌린다.
7. **보고**: 바꾼 토큰(이전 값 → 새 값), 사용처, 사용자 판단을 기다리는 항목을 적는다.
   판단을 기다리는 항목이 있으면 "완료"가 아니라 **"확인 대기"**로 보고한다.
8. **커밋·PR**: 사용자가 요청하면 커밋하고 `create-pr` 스킬로 올린다. 확인 대기
   항목이 남아 있으면 커밋 전에 먼저 답을 받는다.

## 코드 규칙 (`src/app/globals.css`)

| Figma          | 코드                                                                                         |
| -------------- | -------------------------------------------------------------------------------------------- |
| Primitive 색상 | `:root`의 `--primitive-*`. hex 소문자. 유틸리티를 만들지 않는다                              |
| Semantic 색상  | `@theme static`의 `--color-*`. 값은 항상 `var(--primitive-*)` — hex를 직접 쓰지 않는다       |
| 텍스트 스타일  | `@theme`의 `--text-<스타일명 소문자>`와 `--line-height`, `--letter-spacing`, `--font-weight` |

- 텍스트 크기는 rem(px ÷ 16), 행간은 단위 없는 값, 자간은 Figma px 그대로.
  Figma의 float 오차(`1.2999999523162842`)는 소수 둘째 자리로 반올림한다.
- `--color-*: initial;`과 `--text-*: initial;`은 지우지 않는다. 기본 팔레트와
  기본 글자 크기를 막는 줄이다.
- 변수 이름은 Figma Dev Mode 이름과 같아야 한다. 바꾸지 않는다.
- 새 토큰은 같은 그룹(primitive는 색 계열, semantic은 bg/text/icon/border) 안에
  Figma 가이드 순서대로 넣는다.

## 폰트

- Pretendard는 `pretendard` npm 패키지(가변 폰트)라서 굵기가 늘어도 할 일이 없다.
- Axiforma는 Book(300) 파일 하나만 `src/app/fonts/`에 있다. 다른 굵기가 필요하면
  **사용자에게 파일을 받는다.** 유료 폰트라 인터넷에서 받지 않는다. 받은 파일은
  `layout.tsx`의 `localFont` `src` 배열에 굵기와 함께 추가한다.
- Pretendard, Axiforma 외의 새 폰트가 나오면 멈추고 사용자에게 묻는다.

## 이미 확인된 사실

- `Medium` 문자열 변수는 Detail-S-M의 font style 이름이다. 토큰으로 옮기지 않는다.
- 캔버스의 "ZAONE Body-M-B" 레이어는 실제로 Display-M-B 스타일을 쓴다.
  Body-M-B 스타일은 없다. 레이어 이름으로 스타일을 판단하지 않는다.
- Display-\*-B는 이름과 달리 Axiforma Book(300)이다. Figma 값을 따른다.
- `--text-*` 토큰은 쓰는 곳이 없으면 빌드 CSS에 나오지 않는다. 텍스트 스타일은
  빌드 결과가 아니라 스크립트로 확인한다.
