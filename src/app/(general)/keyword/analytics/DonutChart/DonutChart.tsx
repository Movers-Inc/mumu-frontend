import React, { FC, useState, useEffect } from "react";
import classNames from "classnames";
import { PieChart, Pie, Cell, Text } from "recharts";

type theme = "gender" | "device";

interface DonutChartProps {
  className?: string;
  label?: string;
  unit?: string;
  data: { name: string; value: number }[];
  theme?: theme;
}

const DonutChart: FC<DonutChartProps> = (props) => {
  const { className, label, unit, theme = "gender", data } = props;

  const [isClient, setIsClient] = useState(false);

  const COLORS =
    theme === "gender" ? ["#FF5E3A", "#FFC498"] : ["#FF8527", "#FFE2CC"];

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  // Custom label renderer
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    index
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    index: number;
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6; // label 위치 조정
    const x: number =
      Math.cos(-midAngle * RADIAN) > 0
        ? cx + radius * Math.cos(-midAngle * RADIAN)
        : cx + radius * Math.cos(-midAngle * RADIAN);
    const y: number =
      x > cx
        ? cy + radius * Math.sin(-midAngle * RADIAN)
        : cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <Text
        x={x}
        y={y}
        fill="#333"
        textAnchor={x > cx ? "start" : "end"}
        fontSize={14}
      >
        {`${data[index].name} ${data[index].value}%`}
      </Text>
    );
  };

  return (
    <div
      className={classNames(
        "bg-[#FBFBFC] rounded-[16px] relative w-[260px]",
        className
      )}
    >
      {label && (
        <div className="px-5 py-3 text-[20px] font-semibold flex items-center gap-2">
          {label}{" "}
          {unit && (
            <span className="text-[14px] text-[#9C9C9C] font-normal">{`(단위 :  ${unit})`}</span>
          )}
        </div>
      )}

      <div className="w-full flex flex-row justify-center pb-2 pt-2">
        <PieChart width={250} height={180} className="overflow-visible">
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={40}
            outerRadius={70}
            fill="#8884d8"
            label={renderCustomizedLabel} // Custom label 설정
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </div>
    </div>
  );
};

export default DonutChart;
