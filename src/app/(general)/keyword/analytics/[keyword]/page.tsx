"use client";
import React, { useEffect, useState, useMemo } from "react";
import { NextPage } from "next";
import {
  useRouter,
  usePathname,
  useParams,
  useSearchParams
} from "next/navigation";
import classNames from "classnames";

// utils
import { formatDate, isSigned } from "@/utils";

// providers
import { usePopup } from "@/providers";

import { DetailDto } from "@/dtos/keyword/Detail.dto";

// components
import { SubNavigation } from "@/components/templates";
import { SearchInput, Spinner } from "@/components/atoms";
import { EventDatePicker } from "@/components/molecules";
import PostTable from "./PostTable";
import Video from "./Video";
import Chart from "../Chart";
import DonutChart from "../DonutChart";
import BarChart from "../BarChart";

// asset
import Chevron from "../../svg/chevron.svg";
import Calendar from "../../svg/calendar.svg";

import DownChevronImage from "../../svg/down-chevron.svg";

// api
import { AnalyticsAPI, CategoryAPI } from "@/api";

interface Post {
  id: number;
  type: number;
  title: string;
  link: string;
  source: string;
  postDate: string;
}

const HomePage: NextPage = () => {
  const router = useRouter();
  const path = usePathname();
  const keyword: string = decodeURIComponent(useParams().keyword as string);
  const date = useSearchParams().get("date");
  const initcid = useSearchParams().get("cid");

  const { openPopup } = usePopup();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  // const [error, setError] = useState<boolean>(false);
  const [data, setData] = useState<DetailDto | undefined>(undefined);

  const [categories, setCategories] = useState<{
    category1: string;
    category2: string;
    category3: string;
  }>();

  const [yPage, setYPage] = useState<number>(1);
  const [nPage, setNPage] = useState<number>(1);

  const handleSearch = (keyword: string) => {
    if (isSigned()) {
      router.push(
        `/keyword/analytics/${keyword}?cid=${cid}&date=${selectDate.getFullYear()}-${String(
          selectDate.getMonth() + 1
        ).padStart(2, "0")}-${String(selectDate.getDate()).padStart(2, "0")}`
      );
    } else {
      router.push("/login");
    }
  };

  const [cid, setCid] = useState<string>(initcid ? initcid : "");
  const [openDate, setOpenDate] = useState<boolean>(false);
  const [selectDate, setSelectDate] = useState<Date>(
    date
      ? new Date(date)
      : new Date(new Date().setDate(new Date().getDate() - 3))
  );

  const category = (text: string) => {
    return (
      <div
        className={classNames(
          "w-[220px] outline-none text-[#9C9C9C] rounded-[8px]",
          "text-[16px] px-[10px] py-3 bg-[#FFF]",
          "appearance-none flex justify-between items-center",
          "disabled:opacity-100",
          "ring-1 ring-[#FF5E3A] text-[#FF5E3A]"
        )}
      >
        {text}
        <DownChevronImage className={classNames("ml-2 transform")} />
      </div>
    );
  };

  const sampleData = [
    { name: "1월", uv: 241 },
    { name: "2월", uv: 64 },
    { name: "3월", uv: 12 },
    { name: "4월", uv: 43 },
    { name: "5월", uv: 240 },
    { name: "6월", uv: 162 },
    { name: "7월", uv: 81 },
    { name: "8월", uv: 111 },
    { name: "9월", uv: 142 },
    { name: "10월", uv: 76 },
    { name: "11월", uv: 42 },
    { name: "12월", uv: 9 }
  ];

  const fetchDetails = async (cid: string, keyword: string, date: Date) => {
    if (!keyword || !date) return;

    try {
      setIsLoading(true);
      const response = await AnalyticsAPI.getDetail(cid, keyword, date);
      const categoryRes = await CategoryAPI.getParentCategories(parseInt(cid));
      const splitCategories = categoryRes.data.split(" > "); // " > "로 split

      // 상태 업데이트
      setCategories({
        category1: splitCategories[0] || "",
        category2: splitCategories[1] || "",
        category3: splitCategories[2] || ""
      });
      setData(response.data);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      openPopup({
        title: "오류 발생",
        body: "데이터를 불러오는 중 문제가 발생했습니다. 다시 시도해주세요.",
        placeholder: "닫기",
        onNext: async () => {
          const recentKeyword = (await AnalyticsAPI.getRecentKeyword()).data;

          router.replace(
            `/keyword/analytics/${recentKeyword.keyword}?cid=${recentKeyword.parentCID}&date=${recentKeyword.startDate}`
          );
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 로드 시 초기 Fetch
  useEffect(() => {
    if (!initcid) return;
    fetchDetails(cid, keyword, selectDate);
  }, [keyword, selectDate, initcid]);

  if (isLoading)
    return (
      <Spinner
        text={`급상승 키워드를 분석하고 있습니다. \n 최대 2분까지 소요될 수 있습니다.`}
      />
    );

  if (!data || !initcid) return;

  return (
    <div className="w-full max-w-[1440px] min-h-screen">
      <SubNavigation
        items={[
          { label: "급상승 키워드", path: "/keyword" },
          { label: "키워드별 분석", path: path }
        ]}
        currentPath={path}
      />

      <div className="mt-[110px] font-semibold text-[36px] mb-6">
        키워드 분석
      </div>

      {/* <div className="p-5 border" onClick={fetchDetails}>
        불러오기
      </div> */}

      <SearchInput
        className="w-full max-w-[860px] mb-12"
        handleSearch={handleSearch}
        buttonText="분석"
        search={keyword}
      />

      <div className="flex flex-row justify-between w-full items-center mb-5">
        {/* 카테고리 */}
        <div className="flex flex-row w-full gap-1 items-center">
          {/* depth 1 */}
          {category(categories?.category1 ?? "")}
          <Chevron />
          {/* depth 2 */}
          {category(categories?.category2 ?? "")}
          <Chevron />
          {/* depth 3 */}
          {category(categories?.category3 ?? "")}
        </div>

        {/* Date Picker */}
        <div className="flex flex-row gap-2 items-center whitespace-nowrap">
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
            ~{" "}
            {formatDate(
              // new Date(new Date().setDate(new Date().getDate()))
              new Date()
            )}
          </div>
        </div>
      </div>

      {/* Data Analytics Part */}
      <div className="flex flex-row gap-5 justify-between">
        <div className="flex flex-col gap-5 w-full">
          <Chart
            data={data.searchRank}
            date={selectDate ?? new Date()}
            label="카테고리 내 검색어 순위 추이"
            unit="위"
            theme="rank"
          />
          <Chart
            data={data.clicks.map((data) => {
              return { name: data.name, uv: data.uv * 10 + 4 };
            })}
            date={selectDate ?? new Date()}
            label="클릭량 추이"
            unit="회"
            theme="click"
            type="day"
          />
        </div>

        <div className="flex flex-col gap-5 w-full max-w-[540px]">
          <div className="flex flex-row gap-5 w-full">
            <DonutChart
              label="성별 사용률"
              data={[
                { name: "여성", value: Math.floor(data.genderChart.female) },
                { name: "남성", value: Math.ceil(data.genderChart.male) }
              ]}
              theme="gender"
            />
            <DonutChart
              label="디바이스 사용률"
              data={[
                { name: "PC", value: Math.floor(data.deviceChart.pc) },
                { name: "모바일", value: Math.ceil(data.deviceChart.mobile) }
              ]}
              theme="device"
            />
          </div>

          <BarChart
            label="연령대별 사용률"
            unit="%"
            data={[
              { name: "10대", value: Math.floor(data.ageChart.ageGroup10) },
              { name: "20대", value: Math.floor(data.ageChart.ageGroup20) },
              { name: "30대", value: Math.floor(data.ageChart.ageGroup30) },
              { name: "40대", value: Math.floor(data.ageChart.ageGroup40) },
              { name: "50대", value: Math.floor(data.ageChart.ageGroup50) },
              { name: "60대", value: Math.floor(data.ageChart.ageGroup60) }
            ]}
            theme="age"
          />

          <BarChart
            label="요일별 사용률"
            unit="%"
            data={[
              { name: "월", value: Math.floor(data.weekChart.mon) },
              { name: "화", value: Math.floor(data.weekChart.tue) },
              { name: "수", value: Math.floor(data.weekChart.wed) },
              { name: "목", value: Math.floor(data.weekChart.thu) },
              { name: "금", value: Math.floor(data.weekChart.fri) },
              { name: "토", value: Math.floor(data.weekChart.sat) },
              { name: "일", value: Math.floor(data.weekChart.sun) }
            ]}
            theme="day"
          />
        </div>
      </div>

      <div className="mt-[100px] font-semibold text-[36px] mb-6">
        버즈량 분석
      </div>

      <div className="mb-[110px] flex flex-row items-center gap-5">
        <div className="flex flex-col w-[520px] bg-[#FBFBFC] p-5 rounded-[16px] h-[1312px] shrink-0 relative">
          <div className="font-semibold text-[24px] mb-5 shrink-0 absolute top-5 left-5">
            유튜브에서 <span className="text-[#FF5E3A]">{keyword}</span>이(가)
            언급된 인기 동영상
          </div>
          <div className="flex flex-col overflow-y-auto max-h-[calc(100%-160px)] mb-5 gap-6 mt-[60px] scrollbar-hide">
            {data.videos.map((video, index) => (
              <Video key={index} {...video} />
            ))}
          </div>

          <div className="flex flex-col items-center w-full shrink-0">
            {/* <button
              className="w-[150px] bg-[#F0F0F0] rounded-[8px] font-medium text-[#222] py-2 text-center"
              onClick={async () => {
                const newVideos = (
                  await AnalyticsAPI.getYoutubeVideos(keyword, yPage + 1)
                ).data;

                if (newVideos && newVideos.length > 0) {
                  const updatedVideos = data.videos.concat(newVideos);
                  setYPage(yPage + 1);
                  setData({ ...data, videos: updatedVideos });
                }
              }}
            >
              더 보기
            </button> */}
          </div>
        </div>

        <div className="flex flex-col w-full bg-[#FBFBFC] p-5 rounded-[16px] h-[1312px] overflow-x-auto relative">
          <div className="font-semibold text-[24px] mb-5 shrink-0 absolute top-5 left-5">
            네이버에서 <span className="text-[#FF5E3A]">{keyword}</span>이(가)
            언급된 인기 게시물
          </div>

          <div className="flex flex-col overflow-y-auto max-h-[calc(100%-160px)] mb-5 mt-[60px] scrollbar-hide">
            <PostTable<Post>
              data={data.posts.map((post, index) => {
                const newPost: Post = {
                  ...post, // 기존 post의 모든 속성 복사
                  id: index // id로 index 추가
                };
                return newPost;
              })}
              uniqueColumn={"id"}
              schema={[
                ["type", "콘텐츠 타입", "sort"],
                ["title", "게시글 제목", "sort"],
                ["postDate", "게시 일자", "sort"],
                ["source", "출처", "sort"]
              ]}
            />
          </div>

          <div className="flex flex-col items-center w-full shrink-0">
            {/* <button
              className="w-[150px] bg-[#F0F0F0] rounded-[8px] font-medium text-[#222] py-2 text-center"
              onClick={async () => {
                const newPosts = (
                  await AnalyticsAPI.getNaverPost(keyword, nPage + 1)
                ).data;

                if (newPosts && newPosts.length > 0) {
                  const updatedPosts = data.posts.concat(newPosts);
                  setNPage(nPage + 1);
                  setData({ ...data, posts: updatedPosts });
                }
              }}
            >
              더 보기
            </button> */}
          </div>
        </div>
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
