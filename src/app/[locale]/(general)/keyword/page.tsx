"use client";
import React, { useState, useEffect } from "react";
import { NextPage } from "next";
import classNames from "classnames";

// import { useRouter } from "next/navigation";

// components
import Select from "./Select";
import { SubNavigation } from "@/components/templates";
import { Spinner } from "@/components/atoms";
import { EventDatePicker, Pagination } from "@/components/molecules";
import { KeywordTable } from "@/components/organisms";
import History from "./History";

// utils
import { formatDate, isSigned } from "@/utils";

// asset
import Chevron from "./svg/chevron.svg";
import Analytics from "./svg/analytics.svg";
import Rank from "./svg/rank.svg";
import IntervalRank from "./svg/intervalRank.svg";
import Calendar from "./svg/calendar.svg";

import { AnalyticsAPI, CategoryAPI } from "@/api";
import { CategoryDto } from "@/dtos/category.dto";
import { useRouter } from "next/navigation";
import { TrendDto } from "@/dtos/keyword/Trend.dto";
import { usePopup } from "@/providers";

interface History {
  category1: string | null;
  category2: string | null;
  category3: string | null;
}

/** 키워드 페이지 캘린더 선택 범위: 2026.2.20 ~ 오늘 */
const KEYWORD_START_DATE = new Date("2026-02-20");

const HomePage: NextPage = () => {
  const { openPopup } = usePopup();

  const [category1, setCategory1] = useState<number | null>(null);
  const [category2, setCategory2] = useState<number | null>(null);
  const [category3, setCategory3] = useState<number | null>(null);

  const [level1Categories, setLevel1Categories] = useState<CategoryDto[]>([]);
  const [level2Categories, setLevel2Categories] = useState<CategoryDto[]>([]);
  const [level3Categories, setLevel3Categories] = useState<CategoryDto[]>([]);

  const [rank, setRank] = useState<number>(0);
  const [gap, setGap] = useState<number>(0);

  const [histories, setHistories] = useState<History[]>(() =>
    JSON.parse(localStorage.getItem("history") || "[]")
  );

  /** 키워드별 분석 탭 클릭 시 이동할 고정 경로 (API 호출 없음) */
  const recentPath = "/keyword/analytics/폼클렌징?cid=50000451&date=2026-02-20";

  // Fetch Level 1 Categories (pid = 0)
  useEffect(() => {
    const fetchRootCategories = async () => {
      const response = await CategoryAPI.listCategories(0); // pid = 0
      setLevel1Categories(response.data);
    };
    fetchRootCategories();
  }, []);

  // Fetch Level 2 Categories (based on selected category1)
  useEffect(() => {
    if (category1 !== null) {
      const fetchSubCategories = async () => {
        const response = await CategoryAPI.listCategories(category1);
        setLevel2Categories(response.data);
        setCategory2(null); // Reset next level
        setCategory3(null); // Reset next level
        setLevel3Categories([]); // Clear next level categories
      };
      fetchSubCategories();
    }
  }, [category1]);

  // Fetch Level 3 Categories (based on selected category2)
  useEffect(() => {
    if (category2 !== null) {
      const fetchSubCategories = async () => {
        const response = await CategoryAPI.listCategories(category2);
        setLevel3Categories(response.data);
        setCategory3(null); // Reset next level
      };
      fetchSubCategories();
    }
  }, [category2]);

  const [data, setData] = useState<TrendDto[]>([]);

  const [openDate, setOpenDate] = useState<boolean>(false);

  const [selectDate, setSelectDate] = useState<Date>(() => KEYWORD_START_DATE);

  const removeHistory = (index: number) => {
    // 상태 업데이트
    const updatedHistories = histories.filter((_, i) => i !== index);
    setHistories(updatedHistories);

    // 로컬 스토리지 업데이트
    localStorage.setItem("history", JSON.stringify(updatedHistories));
  };

  const storeHistory = () => {
    const newEntry = {
      category1:
        level1Categories.find((cat) => cat.cid === category1)?.name || null,
      category2:
        level2Categories.find((cat) => cat.cid === category2)?.name || null,
      category3:
        level3Categories.find((cat) => cat.cid === category3)?.name || null
    };

    // 로컬 스토리지에서 기존 데이터 가져오기
    const existingData = JSON.parse(localStorage.getItem("history") || "[]");

    // 기존 데이터가 있는지 확인
    const existingIndex = existingData.findIndex(
      (entry: any) =>
        entry.category1 === newEntry.category1 &&
        entry.category2 === newEntry.category2 &&
        entry.category3 === newEntry.category3
    );

    // 기존 데이터가 있으면 제거
    if (existingIndex !== -1) {
      existingData.splice(existingIndex, 1);
    }

    // 새로운 데이터를 맨 앞에 추가
    const updatedData = [newEntry, ...existingData];

    // 로컬 스토리지에 업데이트된 데이터 저장
    localStorage.setItem("history", JSON.stringify(updatedData));

    // 상태 업데이트
    setHistories(updatedData);
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const analytics = async (page: number) => {
    if (!category3) return;

    if (isSigned()) {
      setIsLoading(true);
      storeHistory();

      try {
        const safeRank = Number.isFinite(rank) ? rank : 0;
        const safeGap = Number.isFinite(gap) ? gap : 0;
        const data = await AnalyticsAPI.getTrend(
          category3,
          selectDate,
          safeRank,
          safeGap,
          { pagination: { page: page } }
        );

        setData(data.data ?? []);
        setTotalPages(data.pagination?.totalPages ?? 1);

        if (!data.data?.length) {
          openPopup({
            title: "조회 결과 없음",
            body: "조회된 키워드가 없습니다. 선택한 기간·카테고리에 해당하는 데이터가 없을 수 있습니다.",
            placeholder: "닫기"
          });
        }
      } catch (err) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message ??
          (err as Error)?.message ??
          "키워드 분석 중 오류가 발생했습니다.";
        openPopup({
          title: "오류",
          body: message,
          placeholder: "닫기"
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      useRouter().push("/login");
    }
  };

  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const handlePage = async (page: number) => {
    setPage(page);
    await analytics(page);
  };

  return (
    <div className="w-full max-w-[1440px] min-h-screen flex flex-col pb-[60px]">
      <SubNavigation
        items={[
          { label: "급상승 키워드", path: "/keyword" },
          {
            label: "키워드별 분석",
            path: recentPath
            // ${selectDate.getFullYear()}-${String(
            //   selectDate.getMonth() + 1
            // ).padStart(2, "0")}-${String(selectDate.getDate() + 8).padStart(
            //   2,
            //   "0"
            // )}`
          }
        ]}
        currentPath="/keyword"
      />

      {isLoading && (
        <Spinner
          text={`급상승 키워드를 분석하고 있습니다. \n 최대 2분까지 소요될 수 있습니다.`}
        />
      )}
      <div className="w-full border border-[#E2E2E2] rounded-[16px] bg-[#FBFBFC] p-5 flex flex-col mb-[60px]">
        <div className="text-[#222] font-semibold text-[20px] mb-3">
          카테고리 설정
        </div>

        {/* select category part */}
        <div className="flex flex-col w-full gap-1 mb-[10px]">
          <div className="font-medium text-[#595959] text-[16px]">
            카테고리 선택
          </div>
          <div className="flex flex-row w-full gap-1 items-center">
            {/* 카테고리 1 */}
            <Select
              label=""
              selected={category1}
              onChange={(value) => setCategory1(Number(value))}
              options={level1Categories.map((cat) => {
                return { label: cat.name, value: cat.cid };
              })}
              placeholder="1 카테고리"
            />

            <Chevron />

            {/* 카테고리 2 */}
            <Select
              label=""
              selected={category2}
              onChange={(value) => setCategory2(Number(value))}
              options={level2Categories.map((cat) => {
                return { label: cat.name, value: cat.cid };
              })}
              placeholder="2 카테고리"
              disabled={level2Categories.length == 0}
            />

            <Chevron />

            {/* 카테고리 3 */}
            <Select
              label=""
              selected={category3}
              onChange={(value) => setCategory3(Number(value))}
              options={level3Categories.map((cat) => {
                return { label: cat.name, value: cat.cid };
              })}
              placeholder="3 카테고리"
              disabled={level3Categories.length == 0}
            />
          </div>
        </div>

        {/* search history part */}
        <div className="flex flex-col w-full gap-1 mb-[60px]">
          {/* <div className="font-medium text-[#595959] text-[16px]">
            내가 찾아봤던
          </div>

          <div className="flex flex-row w-full gap-5 items-center">
            <History
              data={histories.map((history: History) => {
                if (history.category3)
                  return {
                    category1: history.category1 ?? "",
                    category2: history.category2 ?? "",
                    category3: history.category3 ?? ""
                  };
                else {
                  return {
                    category1: history.category1 ?? "",
                    category2: "",
                    category3: history.category2 ?? ""
                  };
                }
              })}
              onRemove={removeHistory}
            />
          </div> */}
        </div>

        {/* analytics part */}
        <div className="text-[#222] font-semibold text-[20px] mb-3">
          분석 설정
        </div>

        <div className="flex flex-row w-full gap-5 items-center mb-[60px]">
          <div
            className={classNames(
              "rounded-[8px] relative border border-[#E2E2E2] w-[350px] px-2 py-[14px] bg-white flex flex-row gap-3 items-center"
            )}
          >
            <div className="bg-[#F0F0F0] rounded-full p-[5px]">
              <Analytics />
            </div>

            {/* analytics interval  */}
            <div className="w-full flex flex-col gap-1">
              <div className="text-[16px] font-medium text-[#909090]">
                분석 기간
              </div>
              <div className="flex flex-row gap-2 items-center">
                {/* DatePicker Part */}
                <button
                  className="border border-[#E2E2E2] rounded-[8px] text-[14px] text-[#9C9C9C] p-[6px] relative w-[140px] flex items-center"
                  onClick={() => {
                    setOpenDate(true);
                  }}
                >
                  {formatDate(selectDate)}
                  <div className="absolute top-1/2 right-1 -translate-y-1/2">
                    <Calendar />
                  </div>
                </button>

                {/* End Part */}
                <div className="text-[14px] text-[#9C9C9C]">
                  and{" "}
                  {formatDate(
                    // new Date(new Date().setDate(new Date().getDate()))
                    new Date()
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* keyword rank */}
          <div
            className={classNames(
              "rounded-[8px] relative border border-[#E2E2E2] w-[240px] px-2 py-[14px] bg-white flex flex-row gap-3 items-center"
            )}
          >
            <div className="bg-[#F0F0F0] rounded-full p-[10px]">
              <Rank />
            </div>

            <div className="w-full flex flex-col gap-1">
              <div className="text-[16px] font-medium text-[#909090]">
                현재 검색어 순위
              </div>
              <div className="flex flex-row gap-2 items-center">
                {/* input ref */}
                <input
                  type="number"
                  min={0}
                  value={rank === 0 ? "" : rank}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === "") {
                      setRank(0);
                      return;
                    }
                    const n = parseInt(v, 10);
                    setRank(Number.isNaN(n) ? 0 : n);
                  }}
                  className="border border-[#E2E2E2] rounded-[8px] text-[14px] text-[#222] font-medium p-[7px] w-20"
                />
                <div className="text-[14px] font-semibold text-[#9C9C9C]">
                  이상
                </div>
              </div>
            </div>
          </div>

          {/* keyword rank interval */}
          <div
            className={classNames(
              "rounded-[8px] relative border border-[#E2E2E2] w-[240px] px-2 py-[14px] bg-white flex flex-row gap-3 items-center"
            )}
          >
            <div className="bg-[#F0F0F0] rounded-full p-[5px]">
              <IntervalRank />
            </div>

            <div className="w-full flex flex-col gap-1">
              <div className="text-[16px] font-medium text-[#909090]">
                기간 내 순위 상승폭
              </div>
              <div className="flex flex-row gap-2 items-center">
                {/* input ref */}
                <input
                  type="number"
                  min={0}
                  value={gap === 0 ? "" : gap}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === "") {
                      setGap(0);
                      return;
                    }
                    const n = parseInt(v, 10);
                    setGap(Number.isNaN(n) ? 0 : n);
                  }}
                  className="border border-[#E2E2E2] rounded-[8px] text-[14px] text-[#222] font-medium p-[7px] w-20"
                />
                <div className="text-[14px] font-semibold text-[#9C9C9C]">
                  이상
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-row justify-center items-center gap-4">
          <button
            className={classNames(
              "rounded-[8px] px-10 py-2",
              "bg-[#3129a5] text-[#FFF]",
              category3 === null
                ? "opacity-50"
                : "hover:bg-[#3129ae] hover:text-[#FFF]"
            )}
            onClick={() => analytics(1)}
            disabled={category3 === null}
          >
            키워드 분석
          </button>
          {/* <button
            disabled={data?.length === 0}
            className={classNames(
              "rounded-[8px] px-10 py-2",
              data?.length === 0
                ? "bg-[#E2E2E2] text-[#222]"
                : "bg-[#222] text-[#FFF]"
            )}
          >
            브랜드 검색
          </button> */}
        </div>
      </div>

      {/* rank Table */}
      <div className="w-full ">
        <KeywordTable cid={category3 ?? 0} data={data} date={selectDate} />

        {data.length != 0 && (
          <div className="w-full px-20">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onClick={handlePage}
            />
          </div>
        )}
      </div>

      <EventDatePicker
        open={openDate}
        onClose={() => setOpenDate(false)}
        onChange={setSelectDate}
        date={selectDate}
      />
    </div>
  );
};

export default HomePage;
