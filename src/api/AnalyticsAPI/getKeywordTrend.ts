import { API } from "..";
import { useQuery } from "react-query";
import { TrendDto } from "@/dtos/keyword/Trend.dto";
import { Pagination, PaginationResponse } from "../types";

interface Params {
  pagination?: Pagination;
}

export const getTrend = async (
  cid: number,
  date: Date,
  rank: number,
  gap: number,
  params?: Params
) => {
  const { pagination } = params || {};
  const { data } = await API.post<PaginationResponse<TrendDto>>(
    `/keyword/analytics/trend/cat`,
    {
      cid,
      startDate: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date.getDate()).padStart(2, "0")}`, // Date를 ISO 문자열로 변환
      minRankYesterday: rank,
      minRise: gap,
    },
    {
      params: {
        page: pagination?.page, // 페이지 번호
        size: pagination?.size, // 페이지 크기 }
      },
    }
  );

  return { data: data.data, pagination: data.meta.pagination };
};
