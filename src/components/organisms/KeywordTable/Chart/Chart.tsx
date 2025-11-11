import { TrendDetail } from "@/dtos/keyword/Trend.dto";
import classNames from "classnames";
import React, { FC, useMemo } from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

interface ChartProps {
  className?: string;
  data: TrendDetail[] | undefined;
}

const Chart: FC<ChartProps> = (props) => {
  const { className, data } = props;

  // 데이터 가공: null 값을 500으로 변환하고, X축 레이블(name) 추가
  const processedData = useMemo(() => {
    if (!data) return [];
    const maxRank = 500; // 최대값 기준
    return data.map((value, index) => {
      if (!value || value.uv === null || value.uv === undefined) {
        return { name: `x${index + 1}`, uv: 0 };
      }
      return { name: `x${index + 1}`, uv: maxRank - value.uv };
    });
  }, [data]);

  if (data && data.length < 2) return;

  return (
    <AreaChart
      width={100}
      height={80}
      className={classNames(className, "relative")}
      data={processedData}
    >
      <defs>
        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="30%" stopColor="#FF5E3A" stopOpacity={0.5} />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* 영역 */}
      <Area
        type="monotone"
        dataKey="uv"
        stroke="#FF5E3A"
        strokeWidth={1}
        fillOpacity={1}
        fill="url(#colorUv)"
      />
    </AreaChart>
  );
};

export default Chart;
