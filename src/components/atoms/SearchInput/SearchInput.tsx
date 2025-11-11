import classNames from "classnames";
import React, { FC, useEffect, useState } from "react";
import MagnifierImage from "./magnifier.svg";

interface SearchInputProps {
  className?: string;
  search?: string;
  onInput?: (value: string) => void;
  handleSearch?: (value: string) => void;
  buttonText: string;
  placeholder?: string;
}

const SearchInput: FC<SearchInputProps> = (props) => {
  const { className, search, buttonText, handleSearch } = props;

  const [keyword, setkeyword] = useState<string>(search ?? "");

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setkeyword(e.target.value);
    console.log(keyword);
  };

  useEffect(() => {
    const keyboardEvent = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSearch?.(keyword);
      }
    };

    window.addEventListener("keydown", keyboardEvent);
    return () => window.removeEventListener("keydown", keyboardEvent);
  }, [handleSearch, keyword]);

  return (
    <>
      <div
        className={classNames(
          "relative",
          buttonText === "검색" ? "hover:cursor-pointer" : "",
          className
        )}
        onClick={() =>
          buttonText === "검색" ? handleSearch?.(keyword) : undefined
        }
      >
        <input
          type="text"
          className={classNames(
            "w-full border border-[#E2E2E2] bg-[#FFFFFF] py-[13px] text-[16px] pl-[52px] outline-none rounded-[50px]",
            "placeholder:text-[#9C9C9C]"
          )}
          placeholder={
            props.placeholder ||
            "나에게 이 키워드가 유효할까? 키워드 분석결과에서 확인해보세요"
          }
          onChange={handleInput}
          defaultValue={keyword}
        />

        <div className="absolute top-1/2 left-4 -translate-y-1/2">
          <MagnifierImage />
        </div>

        <button
          className="absolute top-1/2 right-2 -translate-y-1/2 text-white bg-[#FF5E3A] rounded-[50px] text-[16px] px-[26px] py-2"
          onClick={() => handleSearch?.(keyword)}
        >
          {buttonText}
        </button>
      </div>
    </>
  );
};

export default SearchInput;
