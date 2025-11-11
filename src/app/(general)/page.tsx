"use client";

import React, { useState, useEffect } from "react";

import { NextPage } from "next";
import { useRouter } from "next/navigation";
// component
import { SearchInput } from "@/components/atoms";

// provider
import { useToast } from "@/providers";

// constant
import { categories } from "@/constants/category";

// asset
import Chevron from "./chevron.svg";
import classNames from "classnames";
import { AnalyticsAPI } from "@/api";
import { KeywordRankDto } from "@/dtos/keyword/Rank.dto";

const MainPage: NextPage = () => {
  const router = useRouter();

  const [activeIndex, setActiveIndex] = useState<number>(0);

  const [keywordData, setKeywordData] = useState<KeywordRankDto | null>(null);
  // .
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await AnalyticsAPI.getKeywordRank(
          categories[activeIndex].cid
        );
        setKeywordData(data);
      } catch (error) {
        console.error("Error fetching keyword data:", error);
      }
    };

    fetchData();
  }, [activeIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(
        (prevIndex) => (prevIndex + 1 + categories.length) % categories.length
      ); // Cycle through categories
    }, 5000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  // console.log(keywordData);
  const { showToast } = useToast();

  const handleSearch = () => {
    router.push("/keyword");
  };

  const handleIndex = (index: number) => {
    const length = categories.length;

    // 모듈로 연산 처리 (음수 값도 포함)
    const newIndex = ((index % length) + length) % length;

    setActiveIndex(newIndex);
  };

  useEffect(() => {
    const cookies = document.cookie
      .split("; ")
      .find((row) => row.startsWith("redirected="));

    if (cookies) {
      // 리다이렉트 쿠키가 있으면 토스트 표시
      showToast("✅ 로그아웃이 완료되었습니다.");

      // 'redirected' 쿠키만 삭제 (path는 설정한 것과 동일하게)
      document.cookie = "redirected=; Max-Age=0; path=/"; // '/' 경로에서 설정한 쿠키를 삭제
    }
  }, [showToast]);

  return (
    <div className="w-full max-w-[1440px] flex flex-col items-center justify-center">
      <div className="text-[48px] font-bold text-[#222] mb-5 mt-[100px] scrollbar-hide">
        광고효율 최적화는 ? <span className="text-[#3129A5]">무무마케팅</span>
      </div>

      <div className="flex flex-col w-full items-center max-w-[600px]">
        <div onClick={handleSearch} className="w-full flex mb-12">
          <SearchInput
            className="w-full"
            handleSearch={handleSearch}
            buttonText="검색"
          />
        </div>

        <div className="rounded-[16px] border border-[#E2E2E2] w-full max-w-[600px] mb-5">
          {/* category section */}
          <div className="px-5 mt-[25px] flex flex-row items-center gap-2 mb-[26px]">
            <button onClick={() => handleIndex(activeIndex - 1)}>
              <Chevron />
            </button>

            <div className="font-bold text-[#000] text-center w-[210px] py-2 bg-[#FFF5E6] text-[24px] rounded-[16px]">
              {categories[activeIndex].name}
            </div>

            <button
              className="rotate-180"
              onClick={() => handleIndex(activeIndex + 1)}
            >
              <Chevron />
            </button>
          </div>

          {/* keyword section */}
          <div className="px-10 w-full">
            <div className="w-full flex flex-row justify-between items-end mb-5">
              <div className="text-[24px] font-semibold">인기 키워드</div>
              <div className="text-[14px] text-[#9C9C9C]">
                {keywordData?.date.replaceAll("/", ". ")}. 기준
              </div>
            </div>

            <div className="grid grid-cols-2 grid-rows-5 gap-y-[18px] text-[16px] mb-11 w-full grid-flow-col">
              {keywordData?.ranks.map((rankData, index: number) => (
                <div
                  key={index}
                  className="flex font-medium gap-[10px] whitespace-nowrap w-full"
                >
                  {/* 첫 번째 컬럼 */}
                  <span
                    className={classNames(
                      "font-bold min-w-[24px]",
                      index + 1 < 4 ? "text-[#FF6D6D]" : ""
                    )}
                  >
                    {index + 1}
                  </span>

                  {/* 두 번째 컬럼 */}
                  <span
                    className="truncate overflow-hidden text-ellipsis whitespace-nowrap"
                    title={rankData.keyword} // 툴팁 추가
                  >
                    {rankData.keyword}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="hover:cursor-pointer"
          onClick={() => window.open("https://home.dddmkt.com/contact")}
        >
          <img src="/banner.png" className="mb-[100px]" />
        </div>

        {/* <div className="py-5 mb-[200px]">
          <iframe
            src="https://www.photopea.com/#%7B%22files%22%3A%5B%22https%3A%2F%2Fwww.photopea.com%2Fapi%2Fimg2%2Fpug.png%22%5D%2C%22environment%22%3A%7B%7D%7D"
            width={"1024px"}
            height={"1000px"}
          />
        </div> */}
      </div>
    </div>
  );
};

export default MainPage;
