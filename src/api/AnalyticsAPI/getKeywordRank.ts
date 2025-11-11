import { API } from "..";
import { useQuery, UseQueryOptions } from "react-query";
import { Response } from "../types";
import { KeywordRankDto } from "@/dtos/keyword/Rank.dto";

export const getKeywordRank = async (cid: string) => {
  const { data } = await API.get<Response<KeywordRankDto>>(
    `/keyword/rank/${cid}`
  );

  return data.data;
};

export const useGetKeywordRank = (
  cid: string,
  options?: {
    enabled?: boolean;
  }
) => {
  const query = useQuery(["keywordData"], () => getKeywordRank(cid), options);

  const keywordData = query.data;

  return {
    ...query.data,
    keywordData
  };
};
