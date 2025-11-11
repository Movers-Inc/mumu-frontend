import classNames from "classnames";
import React, { FC, useMemo, useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import CustomTooltip from "../Tooltip";

type theme = "rank" | "click";

type type = "day" | "month" | "year";

interface data {
  name: string;
  uv: number;
}

interface ChartProps {
  className?: string;
  data: data[] | undefined;
  date?: Date;
  theme?: theme;
  label?: string;
  unit?: string;
  type?: type;
  height?: number;

  tickFill?: string;
}

const Chart: FC<ChartProps> = (props) => {
  const {
    className,
    label,
    unit,
    data,
    date,
    theme = "rank",
    type = "month",
    tickFill,
  } = props;

  const [isClient, setIsClient] = useState(false);

  // const processedData = useMemo(() => {
  //   if (!data) return [];

  // }, [data, theme]);

  const getMainColor = (theme: theme) => {
    if (theme === "rank") return "#FF5E3A";
    else return "#3BD687";
  };

  const gradientId = useMemo(
    () => `gradient-${theme}-${Math.random()}`,
    [theme]
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;
  // 데이터 가공: null 값을 500으로 변환하고, X축 레이블(name) 추가

  return (
    <div
      className={classNames(
        "bg-[#FBFBFC] rounded-[16px] relative px-5 py-3 flex flex-col gap-5",
        className
      )}
    >
      {label && (
        <div className=" text-[20px] font-semibold flex items-center gap-2">
          {label}{" "}
          {unit && (
            <span className="text-[14px] text-[#9C9C9C] font-normal">{`(단위 :  ${unit})`}</span>
          )}
        </div>
      )}
      <ResponsiveContainer
        width="100%"
        height={props.height || 296}
        className={classNames(className, "relative")}
      >
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: -50, bottom: 0 }}
          className=""
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="30%"
                stopColor={getMainColor(theme)} // getMainColor에서 색상 가져오기
                stopOpacity={0.5}
              />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
            </linearGradient>

            <clipPath id="clipPath">
              <rect x="70" y="0" width="calc(100% - 60px)" height="250" />
            </clipPath>
          </defs>

          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tickFormatter={(name) => {
              if (!date) return "";
              const diffInDays =
                Math.abs(new Date().getTime() - date.getTime()) /
                (1000 * 60 * 60 * 24);

              const [year, month, day] = name.split("-").map(Number);

              if (diffInDays > 500) {
                // 500일 이상일 경우: 각 연도가 시작될 때만 표시
                return month === 1 && day === 1 ? `${year}년` : "";
              } else if (diffInDays > 50) {
                // 50일 이상 500일 이하일 경우: 각 월의 첫날만 표시
                return day === 1 ? `${month}월` : "";
              } else {
                // 50일 이하일 경우: 모든 날짜 표시
                return `${day}일`;
              }
            }}
            tick={{
              fill: tickFill || "#747474",
              fontSize: 14,
              fontWeight: 400,
            }}
            interval={0}
            padding={{ left: 60 }} // X축 여백 설정
          />

          <YAxis
            dataKey="uv"
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
            domain={theme === "rank" ? [500, 1] : ["auto", "auto"]} // rank일 경우 1~500, 아니면 자동
            ticks={theme === "rank" ? [500, 400, 300, 200, 100, 1] : undefined} // 표시할 값 명시
            tick={{
              fill: tickFill || "#747474",
              fontSize: 14,
              fontWeight: 400,
              textAnchor: "start",
            }}
            interval={0}
            allowDataOverflow
            padding={{ bottom: 25 }} // X축 여백 설정
          />

          <CartesianGrid
            stroke="#EAEAEA"
            vertical={false}
            clipPath="url(#clipPath)"
          />

          <Tooltip
            content={<CustomTooltip unit={unit} date={true} />}
            cursor={{ stroke: "rgba(255, 255, 255, 0.2)", strokeWidth: 2 }}
          />

          <Area
            type="monotone"
            dataKey="uv"
            stroke={getMainColor(theme)} // 선 색상 설정
            strokeWidth={1.5} // 선 두께 설정
            fillOpacity={1}
            fill={`url(#${gradientId})`} // 동적으로 생성된 gradient id 연결
            baseValue={theme === "rank" ? "dataMax" : "dataMin"}
            isAnimationActive={true} // 애니메이션 활성화
            animationBegin={0} // 애니메이션 시작 시간 (ms)
            animationDuration={1500} // 애니메이션 지속 시간 (ms)
            animationEasing="ease-out" // 애니메이션 이징(easing) 설정
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
