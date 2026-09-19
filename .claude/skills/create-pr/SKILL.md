---
name: create-pr
description: 현재 브랜치의 작업을 ZAONE-kr/landing에 PR로 올린다. 계정 검사와 품질 검사를 먼저 돌리고, 저장소의 PR 템플릿을 채워서 gh pr create까지 수행한다. 사용자가 "PR 올려줘", "PR 만들어줘", "PR 생성" 이라고 하거나 /create-pr 을 부를 때 사용한다.
---

# PR 생성

아래 순서대로 진행한다. 1~2단계에서 하나라도 걸리면 **PR을 만들지 말고 멈춰서
사용자에게 보고한다.** 검사를 건너뛰고 진행하지 않는다.

## 1. 계정·브랜치 검사

```bash
git branch --show-current
git remote -v
git log -1 --format='%an <%ae>'
git status --short
```

중단 조건:

| 상황                                     | 대응                                                                                    |
| ---------------------------------------- | --------------------------------------------------------------------------------------- |
| 현재 브랜치가 `main`                     | 중단. 브랜치를 먼저 파라고 안내한다                                                     |
| 원격이 `git@zaone:`이 아님               | 중단. `git remote set-url origin git@zaone:ZAONE-kr/landing.git` 을 제안하고 승인받는다 |
| 커밋 작성자가 `develop@zaone.org`가 아님 | 중단. 원인을 함께 확인한다 (`~/.gitconfig`의 includeIf)                                 |
| 커밋되지 않은 변경이 있음                | 사용자에게 알리고, 커밋할지 두고 갈지 확인받는다                                        |

원격 주소를 `git@github.com:`으로 바꾸지 않는다. 개인 계정으로 인증된다.
배경은 이 저장소의 `CLAUDE.md` 참고.

## 2. 품질 검사

```bash
pnpm format:check
pnpm lint
pnpm build
```

하나라도 실패하면 **PR을 만들지 말고** 실패 내용을 그대로 보고한다. 임의로
고치지 말고 사용자에게 어떻게 할지 묻는다.

## 3. 변경 내용 파악

```bash
git log main..HEAD --format='%s%n%n%b'
git diff main...HEAD --stat
```

PR 본문은 커밋 메시지를 그대로 옮기지 말고, **이 브랜치 전체가 무엇을 왜
바꾸는지**를 다시 쓴다.

## 4. 푸시

```bash
git push -u origin "$(git branch --show-current)"
```

## 5. PR 생성

`.github/pull_request_template.md`를 읽어 그 구조를 따른다. HTML 주석
(`<!-- ... -->`)은 지우고 실제 내용으로 채운다. 체크리스트는 2단계에서 실제로
통과한 항목만 체크한다 — 확인하지 않은 항목을 체크하지 않는다.

본문 마지막에 다음 줄을 넣는다.

```
🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

```bash
gh pr create --base main --title "<제목>" --body "<본문>"
```

제목은 한국어로, 무엇을 바꾸는지 한 줄로 쓴다.

## 6. 보고

생성된 PR URL을 사용자에게 전달한다. 2단계에서 건너뛴 검사가 있거나 리뷰어가
알아야 할 미해결 사항이 있으면 함께 적는다.
