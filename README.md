# BitYoungjae의 블로그

바닥부터 시작하는 개인 블로그 만들기 프로젝트

## 주요 기록

### 2020-06-25

- rehype용 prism.js 플러그인 제작함
  - prism.js로 하이라이트된 코드를 정적 생성하기 위한 플러그인임.
- postParser 초기 구현 완료
- 간단한 형태의 slugify 모듈 제작함.
- lib/getNodeTree.tsx 구현 완료
  - posts 폴더를 스캔하여 하부 디렉터리를 카테고리로 하위 마크다운 파일을 포스트로 하는 트리를 생성한다.
  - [테스트 디렉터리](tests/testPosts)
  - [스냅샷 링크](tests/testPosts.snapshot.json)

### 2020-06-24

- Next.js 버전을 canary 버전으로 업데이트 하였다.
  - 관련 이슈 : <https://github.com/vercel/next.js/issues/14489>
- tsconfig.json에 module path 관련 alias를 추가하였다.
  - @atom -> components/atom
  - @layout -> components/layout
