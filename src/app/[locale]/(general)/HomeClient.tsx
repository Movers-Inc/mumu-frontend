"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "@/providers";
import { categories } from "@/constants/category";
import { AnalyticsAPI } from "@/api";
import { KeywordRankDto } from "@/dtos/keyword/Rank.dto";
import { captureCampaignAttribution } from "@/lib/campaign-attribution";
import { useLocale } from "@/providers/LocaleProvider";
import {
  FeatureCards,
  HeroSection,
  QuickKeywordSearch,
  TrendPreview
} from "@/components/public";

interface HomeClientProps {
  initialKeywordData: KeywordRankDto | null;
}

const HomeClient = ({ initialKeywordData }: HomeClientProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [keywordData, setKeywordData] = useState<KeywordRankDto | null>(
    initialKeywordData
  );
  const { showToast } = useToast();
  const { locale } = useLocale();

  useEffect(() => {
    captureCampaignAttribution(window.location.search);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const data = await AnalyticsAPI.getKeywordRank(
          categories[activeIndex].cid
        );
        if (cancelled) return;

        if (locale === "en" && data.ranks?.length) {
          try {
            const response = await fetch("/api/translate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                texts: data.ranks.map((item) => item.keyword)
              })
            });
            if (response.ok) {
              const payload = (await response.json()) as {
                translated?: string[];
              };
              const translated = payload.translated ?? [];
              if (cancelled) return;
              setKeywordData({
                ...data,
                ranks: data.ranks.map((item, index) => ({
                  ...item,
                  keyword: translated[index] || item.keyword
                }))
              });
              return;
            }
          } catch (error) {
            console.error("Failed to translate keywords:", error);
          }
        }

        setKeywordData(data);
      } catch (error) {
        console.error("Error fetching keyword data:", error);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [activeIndex, locale]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(
        (prevIndex) => (prevIndex + 1 + categories.length) % categories.length
      );
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const cookies = document.cookie
      .split("; ")
      .find((row) => row.startsWith("redirected="));

    if (cookies) {
      showToast("✅ 로그아웃이 완료되었습니다.");
      document.cookie = "redirected=; Max-Age=0; path=/";
    }
  }, [showToast]);

  const handleIndex = (index: number) => {
    const length = categories.length;
    setActiveIndex(((index % length) + length) % length);
  };

  return (
    <div className="w-full max-w-[1440px] flex flex-col items-center justify-center">
      <HeroSection />

      <div className="flex flex-col w-full items-center max-w-[600px] px-4">
        <QuickKeywordSearch className="mb-12" />

        <TrendPreview
          activeIndex={activeIndex}
          keywordData={keywordData}
          onPrev={() => handleIndex(activeIndex - 1)}
          onNext={() => handleIndex(activeIndex + 1)}
        />
      </div>

      <FeatureCards />
    </div>
  );
};

export default HomeClient;
