import { API } from "..";
import { useQuery } from "react-query";
import { Response } from "../types";

export const getWeekRank = async (cid: string) => {
  const { data } = await API.get<Response<any>>(
    `/keyword/analytics/week/${cid}`
  );

  return data;
};

export const useGetWeekRank = (cid: string, options = {}) => {
  const query = useQuery(
    ["keywordData", cid], // 캐싱 키에 cid 추가
    () => getWeekRank(cid),
    options // react-query 옵션 전달
  );

  const keywordData = query.data;

  return {
    ...query,
    keywordData
  };
};
