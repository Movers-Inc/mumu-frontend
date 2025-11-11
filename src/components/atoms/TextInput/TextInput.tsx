import classNames from "classnames";
import { useEffect, useState } from "react";

import { forwardRef, ForwardRefRenderFunction } from "react";

// asset
import Hide from "./hide.svg";
import Show from "./show.svg";
import Clear from "./clear.svg";
import Lock from "./lock.svg";
import Mail from "./mail.svg";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  placeholder?: string;
  initial?: string;
  readOnly?: boolean;
  handleInput?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
}

const TextInput: ForwardRefRenderFunction<HTMLInputElement, TextInputProps> = (
  props,
  ref
) => {
  const {
    label,
    className,
    error,
    placeholder,
    initial,
    handleInput,
    type,
    readOnly,
    value,

    ...rest
  } = props;

  const [inputValue, setInputValue] = useState(value ?? initial ?? "");
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    handleInput?.(event);
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const clearInput = () => {
    setInputValue("");
    handleInput?.({
      target: { value: "" }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value);
    }
  }, [value]);

  return (
    <div className={className}>
      {label && (
        <div className="font-pretendard-regular mb-[10px] text-sm text-[#747474]">
          {label}
        </div>
      )}
      <div className="flex justify-center relative">
        {(type === "mail" || type === "password") && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            {type === "mail" && <Mail />}
            {type === "password" && <Lock />}
          </div>
        )}
        <input
          {...rest}
          ref={ref}
          className={classNames(
            "w-full outline-none border border-[#E2E2E2] transition rounded-[8px] text-[#000]",
            "text-[16px] px-4 py-2 bg-[#FFF] flex flex",
            "placeholder:text-[#E2E2E2] font-medium",
            type === "mail" || type === "password" ? "pl-12" : "",
            rest.disabled
              ? "opacity-60"
              : error
              ? "bg-[#FDE0E0]"
              : "hover:border-primary-300 focus:bg-[#F3F3F3]"
          )}
          type={showPassword ? "text" : type}
          placeholder={placeholder}
          value={inputValue}
          onFocus={() => setIsFocused(true)}
          onInput={handleInputChange}
          onBlur={() => setIsFocused(false)}
          onReset={(event) => {
            setInputValue(event.currentTarget.value);
          }}
          readOnly={readOnly}
        />

        {!readOnly && inputValue && isFocused && type != "password" && (
          <button
            type="button"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            onMouseDown={(e) => {
              e.preventDefault(); // 포커스 유지
              clearInput();
            }}
          >
            <Clear />
          </button>
        )}

        {type === "password" && (
          <button
            type="button"
            className="absolute top-1/2 right-4 transform -translate-y-1/2"
            onClick={toggleShowPassword}
          >
            {showPassword ? <Show /> : <Hide />}
          </button>
        )}
      </div>
      {error && <div className="px-2 mt-1 text-sm text-red-500">{error}</div>}
    </div>
  );
};

export default forwardRef(TextInput);
