import classNames from "classnames";
import React, { FC } from "react";
import DownChevronImage from "./down-chevron.svg";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

const Select: FC<SelectProps> = ({ label, children, className, ...rest }) => {
  return (
    <div className={classNames("flex flex-col", className)}>
      {label && (
        <div className="font-pretendard-regular mb-[10px] text-sm text-[#747474]">
          {label}
        </div>
      )}
      <div className="relative">
        <select
          {...rest}
          className={classNames(
            "w-full outline-none transition rounded-[8px] text-[#343434]",
            "text-[14px] px-3 py-[10px] bg-[#F6F6F6] placeholder:text-[#AFB8C0]",
            "appearance-none pr-9"
          )}
        >
          {children}
        </select>
        <DownChevronImage className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
};

export default Select;
