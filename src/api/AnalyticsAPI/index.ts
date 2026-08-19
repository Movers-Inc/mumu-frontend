import {
  getDetail,
  useGetDetail,
  getRecentKeyword,
  getYoutubeVideos,
  getNaverPost,
} from "./getKeywordAnalytics";
import { getWeekRank, useGetWeekRank } from "./getWeekRank";
import { getKeywordRank, useGetKeywordRank } from "./getKeywordRank";
import { getTrend } from "./getKeywordTrend";

const AnalyticsAPI = {
  getDetail,
  useGetDetail,
  getRecentKeyword,
  getYoutubeVideos,
  getNaverPost,
  getWeekRank,
  useGetWeekRank,
  getKeywordRank,
  useGetKeywordRank,
  getTrend,
};

export default AnalyticsAPI;
