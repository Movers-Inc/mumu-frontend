import {
  getDetail,
  useGetDetail,
  getRecentKeyword,
  getYoutubeVideos,
  getNaverPost,
} from "./getKeywordAnalytics";
import { getProductAnalytics } from "./getProductAnalytics";
import { getWeekRank, useGetWeekRank } from "./getWeekRank";
import { getKeywordRank, useGetKeywordRank } from "./getKeywordRank";
import { getTrend } from "./getKeywordTrend";
import { getProductAnalyticsHistories } from "./getProductAnalyticsHistories";
import { getProductAnalyticsHistory } from "./getProductAnalyticsHistory";

const AnalyticsAPI = {
  getDetail,
  useGetDetail,
  getRecentKeyword,
  getYoutubeVideos,
  getNaverPost,
  getProductAnalytics,
  getProductAnalyticsHistories,
  getProductAnalyticsHistory,
  getWeekRank,
  useGetWeekRank,
  getKeywordRank,
  useGetKeywordRank,
  getTrend,
};

export default AnalyticsAPI;
