import { API } from "..";
import { useQuery } from "react-query";
import { Response } from "../types";
import { DetailDto } from "@/dtos/keyword/Detail.dto";
import { RecentKeywordDto } from "@/dtos/keyword/RecentKeyword.dto";
import { YoutubeVideoDto } from "@/dtos/keyword/YoutubeVideo.dto";
import { NaverPostDto } from "@/dtos/keyword/NaverPost.dto";

export const getDetail = async (cid: string, keyword: string, date: Date) => {
  const { data } = await API.post<Response<DetailDto>>(
    `/keyword/analytics/detail/keyword`,
    {
      cid,
      keyword,
      startDate: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date.getDate()).padStart(2, "0")}`, // Date를 ISO 문자열로 변환
    }
  );

  return data;
};

export const getRecentKeyword = async () => {
  const { data } = await API.get<Response<RecentKeywordDto>>(
    `/keyword/analytics/detail/random`
  );

  return data;
};

export const getYoutubeVideos = async (keyword: string, page: number) => {
  const { data } = await API.post<Response<Array<YoutubeVideoDto>>>(
    `/keyword/analytics/detail/youtube?page=${page}`,
    {
      keyword,
    }
  );

  return data;
};

export const getNaverPost = async (keyword: string, page: number) => {
  const { data } = await API.post<Response<Array<NaverPostDto>>>(
    `/keyword/analytics/detail/naver?page=${page}`,
    {
      keyword,
    }
  );

  return data;
};

export const useGetDetail = (cid: string, keyword: string, date: Date) => {
  const query = useQuery(["detail", keyword, date.toISOString()], () =>
    getDetail(cid, keyword, date)
  );

  const detail = query.data;

  return {
    ...query.data,
    detail,
  };
};
