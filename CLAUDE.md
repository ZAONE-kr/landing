@AGENTS.md

# zaone landing

자원(ZAONE) 단체 소개 랜딩 페이지. Next.js(App Router) + TypeScript + Tailwind v4 + pnpm.

## 푸시 전 계정 확인

이 저장소는 **`git@zaone:` 별칭으로만** 푸시한다. GitHub이 안내하는 기본 주소
(`git@github.com:ZAONE-kr/landing.git`)를 그대로 쓰면 **개인 계정으로 인증된다.**

`~/.ssh/config`가 호스트별로 다른 키를 쓰도록 잡혀 있기 때문이다.

| SSH 호스트   | 키                 | 인증되는 계정                 |
| ------------ | ------------------ | ----------------------------- |
| `github.com` | `id_ed25519`       | `Pridesd` (개인)              |
| `zaone`      | `id_ed25519_zaone` | `develop-zaone` (이 저장소용) |

커밋 작성자는 `~/.gitconfig`의 `includeIf "gitdir:.../project/zaone/"`가
`develop-zaone <develop@zaone.org>`로 자동 설정하므로 따로 손댈 필요 없다.

### push 또는 PR 전에 확인할 것

```bash
git remote -v                      # git@zaone:ZAONE-kr/landing.git 이어야 한다
git log -1 --format='%an <%ae>'    # develop-zaone <develop@zaone.org>
```

원격이 `git@github.com:`으로 잡혀 있으면 고친다.

```bash
git remote set-url origin git@zaone:ZAONE-kr/landing.git
```

### `ERROR: Repository not found.` 가 뜨면

**저장소 이름 문제가 아니라 계정 문제일 가능성이 높다.** 이 저장소는 private이고
개인 계정에는 권한이 없다. 권한 없는 계정으로 접근하면 GitHub은 저장소의 존재
자체를 숨기기 위해 "없다"고 답한다. 이름을 의심하기 전에 `git remote -v`부터 본다.

잘못된 계정으로 push가 성공하는 일은 현재 구조에서는 일어나지 않는다. 다만 개인
계정이 나중에 ZAONE-kr에 초대되면 이 방어가 사라지므로, 위 확인 절차는 그대로 둔다.

## PR 만들기

`create-pr` 스킬을 쓴다. 계정·품질 검사를 먼저 돌리고 `.github/pull_request_template.md`
를 채워서 PR을 생성한다.
