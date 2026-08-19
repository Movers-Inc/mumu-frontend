// Tooltip.js

import classNames from "classnames";
import React from "react";
import { TooltipProps } from "recharts";

interface CustomTooltipProps extends TooltipProps<number, string> {
  className?: string;
  unit?: string;
  date?: boolean;
}

const CustomTooltip: React.FC<CustomTooltipProps> = (props) => {
  const { active, payload, unit, date, className } = props;

  if (active && payload && payload.length) {
    const { name, uv, value } = payload[0].payload;

    return (
      <div
        className={classNames(
          "bg-black text-white rounded-md px-[5px] py-[2.5px] shadow-lg relative text-sm transform -translate-x-[30px] -translate-y-[60px]",
          className
        )}
      >
        <div className="flex flex-col items-center">
          {date ? <div>{name}</div> : ""}
          {`${uv ?? value}${unit ?? ""}`}
        </div>
        <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-black"></div>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
