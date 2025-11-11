"use client";

import Logo from "./logo.svg";

import { usePathname } from "next/navigation";
import { FC } from "react";
import classNames from "classnames";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

// component
import { navigation } from "@/constants/navigation";

// api
import { AuthAPI } from "@/api";

// asset
import animation from "./animation.json";

interface NavigationProps {
  className?: string;
}

const Navigation: FC<NavigationProps> = (props) => {
  const { className } = props;

  const { profile, isLoading, isError } = AuthAPI.useGetProfile();

  // 500 에러 또는 로그인 안 됨 시 profile을 즉시 null로 처리

  const pathname = usePathname();

  return (
    <>
      {isLoading && !isError ? (
        <div className="mt-4 w-[15px] h-[15px] fixed top-0 left-1/2 -translate-x-1/2">
          <Lottie animationData={animation} loop={true} />
        </div>
      ) : (
        <>
          <div className="h-[60px]" />
          <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none; /* 스크롤바를 숨깁니다 */
        }
      `}</style>

          <div
            className={classNames(
              "w-full px-5 h-[60px] fixed top-0 left-1/2 -translate-x-1/2 z-header backdrop-filter backdrop-blur-sm overflow-x-scroll flex flex-col items-center",
              className
            )}
            style={{
              scrollbarWidth: "none" /* 파이어폭스 */,
              msOverflowStyle: "none" /* IE 및 Edge */
            }}
          >
            <div className="w-full flex flex-row gap-6 justify-between h-full items-center max-w-[1440px]">
              {/* Logo */}
              <div className="flex flex-row gap-6">
                <a
                  className="mr-6 hover:bg-gray-200 hover:text-gray-800 hover:bg-transparent hover:cursor-pointer"
                  href={"/"}
                >
                  <Logo width={140} height={27} />
                </a>
              </div>

              {/* Navigation */}
              <div className="flex flex-row gap-[60px] items-center whitespace-nowrap">
                {navigation.map((navigate) => (
                  <a
                    key={navigate.name}
                    className={classNames(
                      // 루트 경로(`/`)와 그 외 경로를 구분하는 조건 추가
                      (pathname === "/" && navigate.href === "/") ||
                        (navigate.href != "/" &&
                          pathname.includes(navigate.href))
                        ? "text-[#222]"
                        : "text-[#9C9C9C] hover:text-[#FF5E3A] hover:cursor-pointer",
                      "hover:bg-transparent"
                    )}
                    href={
                      (pathname === "/" && navigate.href === "/") ||
                      (navigate.href != "/" && pathname.includes(navigate.href))
                        ? undefined
                        : navigate.href
                    }
                  >
                    {navigate.name}
                  </a>
                ))}
              </div>

              {/* Login */}

              {profile ? (
                <a
                  className="border border-[#3129a5] text-[#3129a5] text-[16px] px-[18px] py-2 rounded-[50px] hover:cursor-pointer whitespace-nowrap box-border inline-block outline outline-1 outline-transparent"
                  onClick={() => AuthAPI.logout()}
                >
                  로그아웃
                </a>
              ) : (
                <a
                  className="border border-[#3129a5] text-[#3129a5] text-[16px] px-[18px] py-2 rounded-[50px] hover:cursor-pointer whitespace-nowrap box-border inline-block outline outline-1 outline-transparent"
                  href="/login"
                >
                  로그인
                </a>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navigation;
