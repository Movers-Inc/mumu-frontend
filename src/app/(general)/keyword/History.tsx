import React, { FC } from "react";
import Remove from "./svg/remove.svg";
import Sample from "./svg/sample.svg";
import classNames from "classnames";

interface history {
  category1: string;
  category2: string;
  category3: string;
}

interface HistoryProps {
  className?: string;
  data: history[];
  onRemove: (index: number) => void; // 삭제 핸들러 추가
}

const History: FC<HistoryProps> = (props) => {
  const { className, data, onRemove } = props;

  return (
    <>
      {data.map((category: history, index: number) => (
        <div
          key={`${category.category1}-${category.category2}-${category.category3}`}
          className={classNames(
            "rounded-[8px] relative border border-[#E2E2E2] w-[220px] px-2 py-[14px] bg-white flex flex-row gap-3",
            className
          )}
        >
          {/* category image */}
          <div className="bg-[#F0F0F0] flex p-[10px] rounded-full">
            <Sample />
          </div>

          {/* category name */}
          <div className="flex items-center flex-col ">
            <div className="text-[14px] text-[#909090] line-clamp-1">
              {category.category1} {">"} {category.category2}
            </div>
            <div className="text-[20px] font-semibold text-[#222]">
              {category.category3}
            </div>
          </div>

          {/* remove history */}
          <button
            className="absolute top-1 right-1"
            onClick={() => onRemove(index)} // 삭제 핸들러 호출
          >
            <Remove />
          </button>
        </div>
      ))}
    </>
  );
};

export default History;
