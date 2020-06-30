# BitYoungjae의 블로그

바닥부터 시작하는 개인 블로그 만들기 프로젝트

## 주요 기록

### 2020-07-01

- store 생성 과정에서 postData에 대한 확장을 진행.
- store를 통해 생성된 propList.post의 경우 반환하는 postData에 대해 아래의 추가적인 확장 정보를 갖는다.
  - relatedPosts -> 카테고리 단위의 연관 게시물 목록
  - prevPost, nextPost -> 각각 카테고리 단위로 이전과 이후의 게시물의 slug를 가르킨다.
  - categories -> 최하위 카테고리가 배열 형태로 저장된다. ex : `['javascript', '특별-시리즈']`
- 테스트 개선
  - 스냅샷 테스트를 별도의 유틸로 분리함.
  - store.propList 및 getNodeTree 스냅샷 테스트 추가
    - [propList 스냅샷 링크](tests/snapshot/propList.snapshot.json)
    - [getNodeTree 스냅샷 링크](tests/snapshot/fileTree.snapshot.json)

### 2020-06-30

- postStore 구조 정립 및 하기 내용 구현완료
  - store.pathList
    - store.pathList.post -> getStaticPaths에 사용될 게시물 path list
    - store.pathList.category -> getStaticPaths에 사용될 category의 path list
    - store.pathList.tag -> getStaticPaths에 사용될 tag path list
    - store.pathList.page -> getStaticPaths에 사용될 page path list
  - store.propList
    - store.propList.category -> getStaticProps에 사용될 category의 prop list
    - store.propList.tag -> getStaticProps에 사용될 tag prop list
    - store.propList.page -> getStaticProps에 사용될 page prop list
    - store.propList.post -> getStaticProps에 사용될 post prop list
  - store.propList.global -> 각종 전역 데이터
    - store.propList.global.postCount -> 전체 게시물 갯수
    - store.propList.global.categoryCount -> 전체 category 갯수
    - store.propList.global.tagCount -> 전체 tag 갯수

### 2020-06-29

- 트리 탐색을 위한 헬퍼 함수들 작성함.
  - visit.tsx
    - visit 함수
    - findNode 함수
    - findeNodeAll 함수
- postStore 초안 구현완료
  - getCategoriesPath 함수
    - next.js에서 category 관련 path를 생성하기 위한 목적.
  - getPostsByCategories 함수
    - 카테고리 배열로부터 해당 카테고리에 속한 포스트들을 가져오기 위한 목적.

### 2020-06-25

- rehype용 prism.js 플러그인 제작함
  - prism.js로 하이라이트된 코드를 정적 생성하기 위한 플러그인임.
- postParser 초기 구현 완료
- 간단한 형태의 slugify 모듈 제작함.
- lib/getNodeTree.tsx 구현 완료
  - posts 폴더를 스캔하여 하부 디렉터리를 카테고리로 하위 마크다운 파일을 포스트로 하는 트리를 생성한다.
  - [테스트 디렉터리](tests/testPosts)
  - [스냅샷 링크](tests/snapshot/fileTree.snapshot.json)

### 2020-06-24

- Next.js 버전을 canary 버전으로 업데이트 하였다.
  - 관련 이슈 : <https://github.com/vercel/next.js/issues/14489>
- tsconfig.json에 module path 관련 alias를 추가하였다.
  - @atom -> components/atom
  - @layout -> components/layout
