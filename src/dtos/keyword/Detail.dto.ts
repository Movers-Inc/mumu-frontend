import { NaverPostDto } from "./NaverPost.dto";
import { YoutubeVideoDto } from "./YoutubeVideo.dto";

export interface DetailDto {
  data: {
    rank: number;
    keyword: string;
    absClicks: {
      name: string;
      uv: number;
    }[];
  }[];
  searchRank: any[]; // `searchRank`의 데이터 타입이 명확하지 않으므로 `any[]`로 설정
  clicks: Array<{
    name: string; // 날짜 (ISO 8601 형식 문자열)
    uv: number; // 클릭 수
  }>;
  genderChart: {
    male: number; // 남성 비율
    female: number; // 여성 비율
  };
  deviceChart: {
    mobile: number; // 모바일 사용 비율
    pc: number; // PC 사용 비율
  };
  ageChart: {
    ageGroup10: number; // 10대 비율
    ageGroup20: number; // 20대 비율
    ageGroup30: number; // 30대 비율
    ageGroup40: number; // 40대 비율
    ageGroup50: number; // 50대 비율
    ageGroup60: number; // 60대 비율
  };
  weekChart: {
    sun: number; // 일요일 비율
    mon: number; // 월요일 비율
    tue: number; // 화요일 비율
    wed: number; // 수요일 비율
    thu: number; // 목요일 비율
    fri: number; // 금요일 비율
    sat: number; // 토요일 비율
  };

  videos: Array<YoutubeVideoDto>; // `videos`의 구조가 명확하지 않으므로 `any[]`로 설정
  posts: Array<NaverPostDto>;
}
