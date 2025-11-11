import classNames from "classnames";
import React, { FC, useState, useRef, useEffect } from "react";
import DownChevronImage from "./svg/down-chevron.svg";

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps {
  label?: string;
  options: Option[];
  className?: string;
  placeholder?: string;
  selected: number | null | string;
  onChange?: (value: string | number) => void;
  disabled?: boolean; // 추가된 속성
  detail?: boolean;
}

const Select: FC<SelectProps> = ({
  label,
  options,
  className,
  selected,
  placeholder = "Select an option",
  onChange,
  disabled = false, // 기본값 추가
  detail = false
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle outside click to close the dropdown
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleSelect = (value: string | number) => {
    setIsOpen(false);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div
      className={classNames(
        "flex flex-col",
        disabled && "opacity-50 cursor-not-allowed", // 비활성화 스타일 추가
        className
      )}
      ref={dropdownRef}
    >
      {label && (
        <div className="font-pretendard-regular mb-[10px] text-sm text-[#747474]">
          {label}
        </div>
      )}
      <div className="relative w-[220px]">
        <button
          type="button"
          className={classNames(
            "w-full outline-none text-[#9C9C9C] w-[220px]",
            "text-[16px] px-[10px] py-3 bg-[#FFF]",
            "appearance-none flex justify-between items-center",
            "disabled:opacity-100",
            isOpen || selected || detail
              ? "ring-1 ring-[#FF5E3A] text-[#FF5E3A]"
              : "",
            isOpen ? "rounded-t-[8px]" : "rounded-[8px]"
          )}
          onClick={() => setIsOpen((prev) => !prev)}
          disabled={disabled} // 버튼 비활성화 처리
        >
          {selected
            ? options.find((option) => option.value === selected)?.label
            : placeholder}
          <DownChevronImage
            className={classNames("ml-2 transform", isOpen && "rotate-180")}
          />
        </button>

        {isOpen && !disabled && (
          <ul
            className={classNames(
              "ring-1 ring-[#FF5E3A] absolute z-10 w-full bg-white rounded-b-[8px]",
              "shadow-lg max-h-60 overflow-auto border-l border-b border-r border-[#E2E2E2] scrollbar-hide"
            )}
          >
            {options.map((option) => (
              <li
                key={option.value}
                className={classNames(
                  "px-3 py-2 cursor-pointer text-[16px] text-[#FF5E3A]",
                  "hover:bg-[#F6F6F6]",
                  selected === option.value && "bg-[#FFEADE]"
                )}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Select;
