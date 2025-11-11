"use client";
import React, { useState } from "react";
import { NextPage } from "next";
import { SubNavigation } from "@/components/templates";
import AnalyticsResultSection from "./organisms/AnalyticsResultSection";
import { ProductInformation } from "./organisms/ProductInformation";
import { KeywordClickAnalyticsSection } from "./organisms/KeywordClickAnalyticsSection";
import SearchSection from "./molecules/SearchSection";
import { DEFAULT_PRODUCT } from "./constants";
import AnalyticsChartCardSection from "./organisms/AnalyticsChartCardSection";
import { useQuery } from "react-query";
import { AnalyticsAPI } from "@/api";
import { useSearchParams } from "next/navigation";
import { ProductDetailAnalytics } from "@/dtos/product/analytics/ProductAnalytics.dto";

const HomePage: NextPage = () => {
  const [displayData, setDisplayData] =
    useState<ProductDetailAnalytics>(DEFAULT_PRODUCT);

  const searchParams = useSearchParams();

  const { data } = useQuery(
    "AnalyticsAPI.getProductAnalyticsHistory",
    () =>
      AnalyticsAPI.getProductAnalyticsHistory(
        Number(searchParams.get("historyId"))
      ),
    {
      enabled: !!searchParams.get("historyId"),
      onSuccess: (data) => {
        setDisplayData(data);
      },
    }
  );

  return (
    <div className="w-full max-w-[1440px] min-h-screen flex flex-col pb-[60px]">
      <SubNavigation
        items={[{ label: "상품 분석", path: "/product" }]}
        currentPath="/product"
      />
      <div className="flex flex-col mt-[84px]">
        <p className="text-[26px] font-semibold text-[#222222]">
          상품 주소 검색
        </p>
        <SearchSection onSuccess={setDisplayData} />
        <div className="flex flex-row w-full gap-[20px]  mt-[24px]">
          <ProductInformation className="flex-[2]" source={displayData} />
          <KeywordClickAnalyticsSection
            source={displayData}
            className="flex-[3]"
          />
        </div>

        <p className="text-[26px] font-semibold text-[#222222] mt-[100px]">
          분석결과
        </p>
        <AnalyticsChartCardSection source={displayData} />

        <AnalyticsResultSection
          title="SEO 분석 결과"
          style={{
            marginTop: 24,
          }}
          items={[
            {
              title: "상품명",
              score: displayData.seo.productName.score,
              checklist: displayData.seo.productName.checklist,
            },
            {
              title: "상품 이미지",
              score: displayData.seo.productImage.score,
              checklist: displayData.seo.productImage.checklist,
            },
            {
              title: "상품정보",
              score: displayData.seo.productInformation.score,
              checklist: displayData.seo.productInformation.checklist,
            },
            ...(displayData.seo.productTag
              ? [
                  {
                    title: "태그",
                    score: displayData.seo.productTag.score,
                    checklist: displayData.seo.productTag.checklist,
                  },
                ]
              : []),
          ]}
        />
        {displayData.promotion && (
          <AnalyticsResultSection
            title="프로모션 분석결과"
            style={{
              marginTop: 24,
            }}
            items={[
              {
                title: "할인율",
                score: displayData.promotion.discountedRatio.score,
                checklist: displayData.promotion.discountedRatio.checklist,
              },
              {
                title: "텍스트 리뷰 포인트",
                score: displayData.promotion.textReviewPoint.score,
                checklist: displayData.promotion.textReviewPoint.checklist,
              },
              {
                title: "포토 리뷰 포인트",
                score: displayData.promotion.photoReviewPoint.score,
                checklist: displayData.promotion.photoReviewPoint.checklist,
              },
              {
                title: "알림 등록 포인트",
                score: displayData.promotion.alarmPoint.score,
                checklist: displayData.promotion.alarmPoint.checklist,
              },
            ]}
          />
        )}
        {displayData.delivery && (
          <AnalyticsResultSection
            title="배송 분석결과"
            style={{
              marginTop: 24,
            }}
            items={[
              {
                title: "평균 배송기간",
                score: displayData.delivery.averageDeliveryTime.score,
                checklist: displayData.delivery.averageDeliveryTime.checklist,
              },
            ]}
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;
