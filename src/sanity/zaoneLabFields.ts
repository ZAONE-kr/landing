/*
 * ZAONE LAB 적용 현장 카드의 글. 카드(사진·제목·설명·개수·순서)는 코드에 두고, 태그만 운영자가 Sanity
 * Studio에서 추가·수정·삭제·순서 변경한다(단체 결정, 2026-10-07). 사진은 ApplicationsSection에 있다.
 * Studio의 태그 문서(필드 이름·제목·설명, 처음 열었을 때 채워 둘 태그)와 페이지(태그 문서를 아직 게시하지
 * 않았거나 불러오지 못했을 때 보여 줄 태그)가 이 목록을 함께 쓴다. 다른 패키지를 불러오지 않아 양쪽에서 가볍다.
 */

// 태그 문서의 종류 이름이자 문서 ID. 문서가 하나뿐이라 둘을 같게 둔다.
export const ZAONE_LAB_FIELD_TAGS_ID = "zaoneLabFieldTags";

// 카드 순서다. key는 태그 문서의 필드 이름이라, 바꾸면 이미 입력한 태그와 이어지지 않는다.
// 설명의 줄바꿈(\n)은 1024·375 시안의 줄 위치다. 1440 시안은 한 줄이라 그 폭부터는 공백으로 흘린다.
export const ZAONE_LAB_FIELDS = [
  {
    key: "teachers",
    title: "교사와 교육기관",
    description: "0세부터 청소년까지, 재료와 놀이를 수업과 교육환경에 적용합니다.",
    tags: ["교사연수", "워크숍", "교육환경 설계"],
  },
  {
    key: "companies",
    title: "기업과 조직",
    description: "놀이와 아동의 관점으로 익숙한\n문제를 다시 보고 협업하는 방법을 훈련합니다.",
    tags: ["임직원 교육", "ESG/CSR 연계 프로그램"],
  },
  {
    key: "libraries",
    title: "도서관과 지역의 장소",
    description: "재료가 일상적으로 사용되는 교육 프로그램과 공간환경을 함께 설계합니다.",
    tags: ["도서관", "커뮤니티센터", "돌봄기관", "공공 공간"],
  },
  {
    key: "artists",
    title: "예술가와 디자이너",
    description: "재료의 물성과 표현 방법을 함께 연구하고 교육과 작업의 새로운 형식을 만듭니다.",
    tags: ["재료 연구", "공동 워크숍"],
  },
  {
    key: "localOperators",
    title: "지역에서 함께 운영하는 사람들",
    description:
      "재료를 선별하고 손질하고 준비하는 일을 교육현장을 유지하는 지속적인 역할로 만듭니다.",
    tags: ["발달장애인", "시니어", "지역의 협력자"],
  },
  {
    key: "curiousPeople",
    title: "호기심 있는 사람과 커뮤니티",
    description: "아직 이름 붙이지 않은 질문을 가지고 LAB에 들어올 수 있습니다.",
    tags: ["개인", "모임", "팀", "커뮤니티"],
  },
] as const satisfies readonly {
  key: string;
  title: string;
  description: string;
  tags: readonly string[];
}[];

export type ZaoneLabFieldKey = (typeof ZAONE_LAB_FIELDS)[number]["key"];

// 게시된 태그 문서. 태그를 모두 지운 카드는 필드가 빠져서 올 수 있다.
export type ZaoneLabFieldTags = Partial<Record<ZaoneLabFieldKey, string[] | null>>;
