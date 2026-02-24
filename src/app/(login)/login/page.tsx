"use client";

import React, { useState, useCallback, useEffect } from "react";

import { NextPage } from "next";
import classNames from "classnames";

import { useRouter } from "next/navigation";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";

// API part
import { AuthAPI } from "@/api";

// components
import Background from "./Background";
import { TextInput, Spinner } from "@/components/atoms";

// providers
import { useToast, usePopup } from "@/providers";

// asset
import Logo from "./svg/logo.svg";
import Check from "./svg/check.svg";
import UnCheck from "./svg/uncheck.svg";
import Chevron from "./svg/chevron.svg";

interface SignInInput {
  id: string;
  password: string;
}

/** 백엔드 에러 응답에서 메시지 추출 (NestJS 401, message 문자열/배열, error 필드 지원) */
function getLoginErrorMessage(error: unknown): string {
  const fallback = "로그인에 실패했습니다. 다시 시도해주세요.";
  const err = error as {
    response?: { data?: { message?: string | string[]; error?: string } };
    message?: string;
  };
  const data = err?.response?.data;
  if (data && typeof data === "object") {
    if (typeof data.message === "string" && data.message.trim()) return data.message;
    if (Array.isArray(data.message) && data.message[0]) return String(data.message[0]);
    if (typeof data.error === "string" && data.error.trim()) return data.error;
  }
  if (typeof err?.message === "string" && err.message.trim()) return err.message;
  return fallback;
}

const LoginPage: NextPage = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { showToast } = useToast();
  const { openPopup } = usePopup();

  const [saveEmail, setSaveEmail] = useState<boolean>(false);
  const [savePassword, setSavePassword] = useState<boolean>(false);

  const {
    register: register,
    watch: watch,
    handleSubmit: handleSubmit,
    setValue,
    trigger,
    formState: { isValid: isValid }
    // errors: errors
  } = useForm<SignInInput>({
    mode: "onChange"
  });

  // 로컬 스토리지에서 초기값 설정
  useEffect(() => {
    const storedEmail = localStorage.getItem("savedEmail") || "";
    const storedPassword = localStorage.getItem("savedPassword") || "";

    if (storedEmail) {
      setValue("id", storedEmail);
      setSaveEmail(true);
    }

    if (storedPassword) {
      setValue("password", storedPassword);
      setSavePassword(true);
    }

    // 초기값 설정 후 검증 상태 강제 업데이트
    trigger();
  }, [setValue, trigger]);

  // handle submit for
  const handleValidSubmit: SubmitHandler<SignInInput> = useCallback(
    async (data) => {
      setIsLoading(true);

      try {
        if (saveEmail) {
          console.log("email saved");
          localStorage.setItem("savedEmail", data.id);
        } else {
          console.log("email removed");
          localStorage.removeItem("savedEmail");
        }

        if (savePassword) {
          console.log("password saved");
          localStorage.setItem("savedPassword", data.password);
        } else {
          console.log("password removed");
          localStorage.removeItem("savedPassword");
        }
        await AuthAPI.login({
          id: data.id,
          password: data.password
        });
      } catch (error: unknown) {
        setIsLoading(false);

        const message = getLoginErrorMessage(error);

        // 다음 틱에서 팝업을 띄워 React 상태 배칭 후 확실히 렌더되도록 함
        setTimeout(() => {
          openPopup({
            title: "로그인 실패",
            body: message,
            placeholder: "닫기"
          });
        }, 0);
      }
    },
    [saveEmail, savePassword, openPopup]
  );

  const handleInvalidSubmit: SubmitErrorHandler<SignInInput> = useCallback(
    (errors) => {
      const errorMessage = Object.values(errors).map(
        ({ message }) => message
      )?.[0];

      if (errorMessage) {
        showToast(errorMessage);
      }
      // handlePopup("로그인 실패", "알 수 없는 오류가 발생하였습니다.", "닫기");
    },
    []
  );

  useEffect(() => {
    const keyboardEvent = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSubmit(handleValidSubmit, handleInvalidSubmit);
      }
    };

    window.addEventListener("keydown", keyboardEvent);
    return () => window.removeEventListener("keydown", keyboardEvent);
  }, []);

  return (
    <>
      <div className="h-screen w-screen bg-white hidden lg:block font-pretendard-regular">
        {isLoading && <Spinner text="로그인 중..." />}

        <div className="flex flex-row w-full h-full">
          <div className="py-11 pl-10 grow">
            <Background />
          </div>

          {/* login section */}
          <div className="min-w-[540px] flex flex-col shrink-0 items-center px-[70px] justify-center relative">
            <button
              className="absolute top-11 left-4"
              onClick={() => router.back()}
            >
              <Chevron />
            </button>

            <div className="text-[32px] text-[#343434] mb-12">
              <Logo />
            </div>
            <div className="text-[16px] text-[#343434] font-semibold text-[36px]">
              Welcome ! 🎉🎉
            </div>
            <div className="text-[#9C9C9C] text-[16px] font-medium mb-12">
              무무마케팅 솔루션에 방문해주신 것을 환영합니다.
            </div>

            <div className="w-full flex flex-col gap-4 mb-5">
              <TextInput
                key="id"
                placeholder="E-mail을 입력해 주세요."
                value={watch("id")}
                type="mail"
                autoComplete="name"
                {...register("id", {
                  required: "이메일을 입력해주세요"
                })}
              />

              <TextInput
                key="pw"
                placeholder="Password를 입력해 주세요."
                value={watch("password")}
                type="password"
                autoComplete="name"
                {...register("password", {
                  required: "비밀번호를 입력해주세요"
                })}
              />
            </div>

            <div className="flex flex-row w-full justify-between mb-12">
              <div className="flex flex-row gap-4">
                <div className="flex flex-row gap-2 items-center text-[#E2E2E2] text-[16px]">
                  {/* Save Feild (local storage)*/}
                  <button onClick={() => setSaveEmail((prev) => !prev)}>
                    {saveEmail ? <Check /> : <UnCheck />}
                  </button>
                  이메일저장
                </div>

                <div className="flex flex-row gap-2 items-center text-[#E2E2E2] text-[16px]">
                  <button onClick={() => setSavePassword((prev) => !prev)}>
                    {savePassword ? <Check /> : <UnCheck />}
                  </button>
                  패스워드 저장
                </div>
              </div>

              {/* <button className="text-[#E2E2E2] text-[16px] underline">
                Password 찾기
              </button> */}
            </div>

            <div className="w-full">
              <button
                className={classNames(
                  "rounded-[8px] font-semibold",
                  "text-center text-[#FFF] py-[6px] w-full text-[20] transform",
                  isValid ? "bg-[#222]" : "bg-[#222] bg-opacity-30"
                )}
                onClick={
                  isValid
                    ? handleSubmit(handleValidSubmit, handleInvalidSubmit)
                    : undefined
                }
              >
                Log in
              </button>
            </div>

            <div className="mt-4 text-center text-[14px] text-[#222]">
              무무 마케팅이 처음이신가요?{" "}
              <span
                className="font-bold underline hover:cursor-pointer"
                onClick={() => window.open("https://home.dddmkt.com/contact")}
              >
                지금 바로 도입하기
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
