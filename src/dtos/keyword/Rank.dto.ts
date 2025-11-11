export interface KeywordRankDto {
  message: string | null;
  statusCode: number;
  returnCode: number;
  date: string;
  datetime: string;
  range: string;
  ranks: Rank[];
}

export interface Rank {
  rank: number;
  keyword: string;
  linkId: string;
}
