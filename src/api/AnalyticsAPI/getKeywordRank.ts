import { API } from "..";
import { useQuery } from "react-query";
import { Response } from "../types";
import { KeywordRankDto } from "@/dtos/keyword/Rank.dto";

function unwrapKeywordRank(payload: unknown): KeywordRankDto | null {
  if (!payload || typeof payload !== "object") return null;

  const root = payload as Record<string, unknown>;
  const nested =
    root.data && typeof root.data === "object"
      ? (root.data as Record<string, unknown>)
      : root;

  const ranks = nested.ranks;
  if (!Array.isArray(ranks) || ranks.length === 0) return null;

  return nested as unknown as KeywordRankDto;
}

export const getKeywordRank = async (cid: string) => {
  const { data } = await API.get<Response<KeywordRankDto>>(
    `/keyword/rank/${cid}`
  );

  const parsed = unwrapKeywordRank(data);
  if (!parsed) {
    throw new Error("Keyword rank response is empty");
  }

  return parsed;
};

export const useGetKeywordRank = (
  cid: string,
  options?: {
    enabled?: boolean;
  }
) => {
  const query = useQuery(
    ["keywordData", cid],
    () => getKeywordRank(cid),
    options
  );

  return {
    ...query,
    keywordData: query.data
  };
};
