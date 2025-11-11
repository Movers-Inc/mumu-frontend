import { formatDate } from "@/utils";
import classNames from "classnames";
import React, { FC, useState } from "react";
import { useRouter } from "next/navigation";
import Chart from "./Chart";

import dynamic from "next/dynamic";
import animationData from "./animation.json";

import { TrendDto } from "@/dtos/keyword/Trend.dto";
import Sort from "./sort.svg";

// 동적으로 Lottie 컴포넌트를 로드 (SSR 비활성화)
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface KeywordTableProps {
  className?: string;
  data?: TrendDto[];
  date: Date;
  cid: number;
}

const KeywordTable: FC<KeywordTableProps> = (props) => {
  const { className, data, date, cid } = props;

  const router = useRouter();

  // 정렬 상태 관리
  const [sortConfig, setSortConfig] = useState<{
    key: "keyword" | "rise";
    direction: "asc" | "desc";
  } | null>(null);

  // 정렬 함수
  const sortedData = React.useMemo(() => {
    if (!data) return [];
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const { key, direction } = sortConfig;

      const valueA = a[key];
      const valueB = b[key];

      if (typeof valueA === "string" && typeof valueB === "string") {
        return direction === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      if (typeof valueA === "number" && typeof valueB === "number") {
        return direction === "asc" ? valueA - valueB : valueB - valueA;
      }

      return 0; // 기본값
    });
  }, [data, sortConfig]);

  // 정렬 상태 변경
  const handleSort = (key: "keyword" | "rise") => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        // 동일한 키를 클릭하면 방향 변경
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc"
        };
      }
      // 새로운 키 클릭 시 오름차순으로 설정
      return { key, direction: "asc" };
    });
  };

  const getNewTag = (rank: number | null) => {
    if (!rank) {
      return (
        <div className="bg-[#CDF1FF] text-[#17BDFF] font-medium text-[16px] rounded-[8px] px-2 py-[2.5px]">
          NEW
        </div>
      );
    } else return;
  };

  const gapTag = (gap: number) => {
    if (gap === 0) return "-";

    if (gap < 0)
      return (
        <div className="bg-[#DDEECE] text-[#5AB80B] font-medium text-[16px] rounded-[8px] px-2 py-[2.5px] flex">
          {Math.abs(gap)} ↓
        </div>
      );
    else
      return (
        <div className="bg-[#FFC7C7] text-[#FF6464] font-medium text-[16px] rounded-[8px] px-2 py-[2.5px] flex">
          {gap} ↑
        </div>
      );
  };

  return (
    <div
      className={classNames(
        "rounded-[16px] overflow-hidden border border-[#E2E2E2]",
        className
      )}
    >
      <table className="w-full bg-[#FBFBFC] text-[14px]">
        <thead>
          <tr className="bg-[#FFF] text-center text-[#9C9C9C]">
            <th className="px-4 py-2">
              급상승 키워드
              <button onClick={() => handleSort("keyword")}>
                <Sort className="ml-1" />
              </button>
            </th>
            <th className="px-4 py-2">검색량 추이</th>
            <th className="px-4 py-2">
              검색어 순위
              <span className="text-[#E2E2E2] ml-1">{formatDate(date)}</span>
            </th>
            <th className="px-4 py-2">
              검색어 순위
              <span className="text-[#E2E2E2] ml-1">
                {formatDate(new Date(new Date().setDate(new Date().getDate())))}
              </span>
            </th>
            <th className="px-4 py-2">
              상승폭
              <button onClick={() => handleSort("rise")}>
                <Sort className="ml-1" />
              </button>
            </th>
            <th className="w-[100px]"> </th>
            <th className="px-6 py-2">상세보기</th>
            <th className="px-6 py-2">브랜드 검색</th>
          </tr>
        </thead>

        <tbody>
          {sortedData?.length === 0 || !sortedData ? (
            <tr>
              <td
                colSpan={8}
                className="text-center h-[800px] text-[#E2E2E2] text-[20px] font-semibold"
              >
                <div className="flex flex-col items-center py-[120px] gap-4 ">
                  <Animate />
                  <span>키워드 분석을 진행해주세요.</span>
                </div>
              </td>
            </tr>
          ) : (
            sortedData.map((item, index) => (
              <tr
                key={index}
                className={classNames(
                  "h-[120px]",
                  index % 2 === 0 ? "bg-[#FBFBFC]" : "bg-white"
                )}
              >
                {/* 키워드 이름 */}
                <td className="h-[120px] align-middle text-center">
                  {item.keyword}
                </td>

                {/* 검색량 추이 */}
                <td className="h-[120px] align-middle text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Chart data={item.detail} />
                  </div>
                </td>

                {/* 시작날짜 순위 */}
                <td className="h-[120px] align-middle text-center">
                  {item.rankAtFirst ? `${item.rankAtFirst}위` : "-"}
                </td>

                {/* 오늘자 순위 */}
                <td className="h-[120px] align-middle text-center">
                  {item.rankAtLast ? (
                    <div className="flex items-center gap-2 justify-center">
                      {getNewTag(item.rankAtFirst)}
                      <div>{`${item.rankAtLast}위`}</div>
                    </div>
                  ) : (
                    "-"
                  )}
                </td>

                {/* 상승폭 */}
                <td className="h-[120px] align-middle text-center">
                  <div className="flex items-center gap-2 justify-center">
                    {gapTag(item.rise)}
                  </div>
                </td>

                <td className="h-[120px] align-middle text-center"></td>

                {/* 액션 버튼 */}
                <td className="h-[120px] align-middle text-center">
                  <button
                    className="hover:bg-[#FF5E3A] hover:text-[#FFF] bg-[#FFEADE] text-[#222] font-semibold px-6 py-2 rounded-[8px]"
                    onClick={() => {
                      router.push(
                        `/keyword/analytics/${
                          item.keyword
                        }?cid=${cid}&date=${date.getFullYear()}-${String(
                          date.getMonth() + 1
                        ).padStart(2, "0")}-${String(date.getDate()).padStart(
                          2,
                          "0"
                        )}`
                      );
                    }}
                  >
                    상세보기
                  </button>
                </td>
                <td className="h-[120px] align-middle text-center">
                  <button
                    className="hover:bg-[#222] hover:text-[#FFF] bg-[#E2E2E2] text-[#222] font-semibold px-6 py-2 rounded-[8px]"
                    onClick={() => {
                      window.open(
                        `https://search.shopping.naver.com/ns/search?query=${item.keyword}`
                      );
                    }}
                  >
                    브랜드 검색
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default KeywordTable;

const Animate: React.FC = () => {
  return (
    <div className="w-40 h-40 flex justify-center items-center">
      <Lottie animationData={animationData} loop={true} />
    </div>
  );
};
