export interface TrendDto {
  keyword: string;
  detail: TrendDetail[];
  rankAtFirst: number;
  rankAtLast: number;
  rise: number;
}

export interface TrendDetail {
  name: string; // 날짜 문자열
  uv: number; // UV 값
}
