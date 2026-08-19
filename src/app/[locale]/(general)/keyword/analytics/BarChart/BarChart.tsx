import React, { FC, useMemo, useEffect, useState } from "react";
import classNames from "classnames";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

import CustomTooltip from "../Tooltip";

type theme = "age" | "day";

interface BarChartProps {
  className?: string;
  data: { name: string; value: number }[];
  theme?: theme;
  label?: string;
  unit?: string;
}

const BarChart: FC<BarChartProps> = (props) => {
  const { className, label, unit, data } = props;

  const [isClient, setIsClient] = useState(false);

  // 최대값 찾기
  const maxValue = useMemo(
    () => Math.max(...data.map((item) => item.value)),
    [data]
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;
  // 데이터 가공: null 값을 500으로 변환하고, X축 레이블(name) 추가

  return (
    <div
      className={classNames("bg-[#FBFBFC] rounded-[16px] relative", className)}
    >
      {label && (
        <div className="px-5 py-3 text-[20px] font-semibold flex items-center gap-2">
          {label}{" "}
          {unit && (
            <span className="text-[14px] text-[#9C9C9C] font-normal">{`(단위 :  ${unit})`}</span>
          )}
        </div>
      )}
      <ResponsiveContainer width="100%" height={180} className={""}>
        <RechartsBarChart data={data} barSize={30}>
          <XAxis dataKey="name" tickLine={false} color="#F0F0F0" />

          <Tooltip content={<CustomTooltip unit={unit} />} cursor={false} />

          <Bar
            dataKey="value"
            radius={[5, 5, 0, 0]}
            width={20}
            isAnimationActive={true} // 애니메이션 활성화
            animationBegin={0} // 애니메이션 시작 시간 (ms)
            animationDuration={1500} // 애니메이션 지속 시간 (ms)
            animationEasing="ease-out" // 애니메이션 이징(easing) 설정
          >
            {/* 상단 둥글게 */}
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.value === maxValue ? "#FF5E3A" : "#F0F0F0"} // 조건부 색상
              />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
