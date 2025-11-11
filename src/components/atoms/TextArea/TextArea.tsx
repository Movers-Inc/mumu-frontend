import classNames from "classnames";
import { forwardRef, ForwardRefRenderFunction, useState } from "react";
import Check from "./check.svg";
import Checked from "./checked.svg";

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  placeholder?: string;
  initial?: string;
  handleInput?: (value: string) => void;
  secret?: (state: boolean) => void;
}

const TextArea: ForwardRefRenderFunction<HTMLTextAreaElement, TextAreaProps> = (
  props,
  ref
) => {
  const {
    label,
    className,
    placeholder,
    secret,
    initial,
    handleInput,
    ...rest
  } = props;

  const [charCount, setCharCount] = useState<number>(0);
  const [check, setcheck] = useState<boolean>(false);

  const [inputValue, setInputValue] = useState(initial ? initial : "");

  const handleSecret = () => {
    setcheck(!check);
    secret?.(!check);
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputText = event.target.value;
    setCharCount(inputText.length);
    setInputValue(event.target.value);
    handleInput?.(event.target.value);
  };

  return (
    <div>
      {label && (
        <div className="font-pretendard-regular mb-2 text-sm text-[#949494]">
          {label}
        </div>
      )}
      <div className={classNames("flex justify-center", "h-[200px]")}>
        <textarea
          {...rest}
          ref={ref}
          className={classNames(
            "w-full text-[16px] outline-none transition",
            "rounded-[12px] border-[0.5px] border-[#DEE3E8] bg-[#FFFFFF] p-3",
            "placeholder:text-[#AFb8C0] text-[16px]",
            rest.disabled
              ? "opacity-60"
              : "hover:border-primary-300 focus:border-primary-500",
            className
          )}
          placeholder={placeholder}
          value={inputValue}
          onChange={handleChange} // 글자 수 변경 시 이벤트 핸들러 호출
        />
      </div>
      <div
        className={classNames(
          "flex flex-row justify-end mt-2 text-[14px]",
          "text-[#000]",
          secret ? "justify-between" : "justify-end"
        )}
      >
        {secret && (
          <div
            className="text-[14px] flex flex-row gap-1 items-center font-400"
            onClick={handleSecret}
          >
            {check ? <Checked /> : <Check />} 비밀글로 문의하기
          </div>
        )}

        <div>
          {charCount}
          <span className={classNames("text-[#AFB8C0]")}>/1000</span>
        </div>
      </div>
      {charCount > 1000 && (
        <div className="mt-3 text-sm text-red-500">
          {"1000자를 초과하였습니다."}
        </div>
      )}
    </div>
  );
};

export default forwardRef(TextArea);
