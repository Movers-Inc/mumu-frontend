"use client";
import React, { useMemo } from "react";
import { NextPage } from "next";

// component
import { SubNavigation, SubSubNavigation } from "@/components/templates";
import {
  DoughnutChart,
  HorizontalBarChart,
  VerticalBarChart,
  BubbleChart
} from "@/components/charts";

import { BrandAPI } from "@/api";
import { processDashboardData } from "@/utils";

import Data from "./income.json";

const HomePage: NextPage = () => {
  const { data, isLoading } = BrandAPI.useGetDashboard();

  // Always call useMemo, even if data is undefined
  const processedData = useMemo(() => {
    if (!data) return null; // Handle case where data is undefined
    return processDashboardData(data.data);
  }, [data]);

  if (isLoading || !processedData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-[1440px] w-full h-screen flex flex-col">
      <SubNavigation
        items={[
          { label: "매니저 관리", path: "/manage/mumu" },
          { label: "브랜드 관리", path: "/manage/mumu/brand" }
        ]}
        currentPath="/manage/mumu/brand"
      />
      <SubSubNavigation
        items={[
          {
            label: "브랜드 대시보드",
            detail: "등록된 브랜드의 종합 데이터를 보여줍니다.",
            path: "/manage/mumu/brand"
          },
          {
            label: "브랜드 등록/수정",
            detail: "DDD마케팅 광고주의 정보를 등록/수정 합니다.",
            path: "/manage/mumu/brand/manage"
          }
        ]}
        currentPath="/manage/mumu/brand"
      />
      <div className="flex flex-col gap-6 pb-10">
        <div className="flex flex-row gap-6 justify-between h-[366px]">
          <div className="px-4 py-2 max-w-[490px] basis-1/2 border-[0.8px] rounded-[10px] bg-[#FBFBFC]">
            <DoughnutChart {...processedData.doughnut} />
          </div>
          <div className="flex-grow px-4 py-2 basis-1/2 border-[0.8px] rounded-[10px] bg-[#FBFBFC]">
            <div className="p-1 text-left text-[24px] font-semibold">
              매출액
            </div>
            <div className="px-1 text-left text-[16px] font-regular text-[#9C9C9C]">
              (단위 : 개사)
            </div>
            <div className="h-[280px]">
              <HorizontalBarChart {...processedData.horizontalBar} />
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-6 justify-between min-h-[366px]">
          <div className="px-4 py-2 flex-grow basis-1/2 border-[0.8px] rounded-[10px] bg-[#FBFBFC]">
            <div className="p-1 text-left flex justify-between items-center w-full">
              <span className="text-[24px] font-semibold">
                최근 3개월 신규유입/이탈 추이
              </span>

              {/* Legend */}
              <div className="text-[16px] flex flex-row gap-[10px]">
                <div className="flex flex-row gap-1 items-center">
                  <div className="w-[10px] aspect-square rounded-full bg-[#3129a5]" />
                  유입
                </div>
                <div className="flex flex-row gap-1 items-center">
                  <div className="w-[10px] aspect-square rounded-full bg-[#E2E2E2]" />
                  이탈
                </div>
              </div>
            </div>
            <div className="px-1 text-left text-[16px] font-regular text-[#9C9C9C]">
              (단위 : 개사)
            </div>
            <div className="h-[280px]">
              <VerticalBarChart
                labels={Data.map((datum) => {
                  return datum.label;
                })}
                data1={Data.map((datum) => {
                  return datum.income;
                })}
                data2={Data.map((datum) => {
                  return datum.outcome;
                })}
              />
            </div>
          </div>

          {/* <div className="relative max-w-[690px] px-4 py-2 basis-1/2 border-[0.8px] rounded-[10px] bg-[#FBFBFC]"> */}
          {/* <div className="absolute top-3 left-4 z-10">
              <div className="text-left text-[24px] font-semibold">
                브랜드 회사 규모
              </div>
              <div className="text-left text-[16px] font-regular text-[#9C9C9C]">
                (단위 : 직원 수)
              </div>
            </div> */}

          {/* Bubble Chart */}
          {/* <div className="h-[280px] z-0">
              <BubbleChart data={processedData.bubbleChart} />
            </div> */}
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
