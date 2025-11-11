export interface NaverPostDto {
  link: string; // 게시물 링크
  type: number; // 게시물 타입 (e.g., 0, 1, 2, 3 등)
  title: string; // 게시물 제목
  postDate: string; // 게시물 날짜 (형식: YYYYMMDD 또는 다른 문자열)
  source: string; // 게시물 출처
}
