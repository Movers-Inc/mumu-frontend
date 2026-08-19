import { categories } from "@/constants/category";
import { API_URL } from "@/constants";
import { KeywordRankDto } from "@/dtos/keyword/Rank.dto";
import { translateKeywordsToEnglish } from "@/lib/i18n/translate-keywords";
import { isLocale } from "@/lib/i18n/routing";
import HomeClient from "./HomeClient";

async function getInitialKeywordData(): Promise<KeywordRankDto | null> {
  try {
    const response = await fetch(
      `${API_URL}/keyword/rank/${categories[0].cid}`,
      { next: { revalidate: 60 } }
    );
    if (!response.ok) return null;

    const json = await response.json();
    const payload = json?.data ?? json;
    if (!Array.isArray(payload?.ranks) || payload.ranks.length === 0) {
      return null;
    }
    return payload as KeywordRankDto;
  } catch (error) {
    console.error("Failed to load initial keyword ranks:", error);
    return null;
  }
}

export default async function MainPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  let initialKeywordData = await getInitialKeywordData();

  if (
    isLocale(locale) &&
    locale === "en" &&
    initialKeywordData?.ranks?.length
  ) {
    const translated = await translateKeywordsToEnglish(
      initialKeywordData.ranks.map((item) => item.keyword)
    );
    initialKeywordData = {
      ...initialKeywordData,
      ranks: initialKeywordData.ranks.map((item, index) => ({
        ...item,
        keyword: translated[index] || item.keyword
      }))
    };
  }

  return <HomeClient initialKeywordData={initialKeywordData} />;
}
