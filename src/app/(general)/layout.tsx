import "../globals.css";
import { Inter } from "next/font/google";
import {
  ReactQueryProvider,
  RoleProvider,
  PopupProvider,
  ToastProvider
} from "@/providers";
import { Navigation } from "@/components/templates";
import { cookies } from "next/headers";
import Display from "../Display";
import React, { ReactElement } from "react";
import { Role } from "@/dtos/common";
import localFont from "next/font/local";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "무무 Marketing 서비스 포털",
  description: "무무 Marketing 서비스 포털",
  icons: {
    icon: "/DDD-favicon.ico" // favicon 경로 추가
  }
};

declare global {
  interface UserProps {
    role?: string; // 전역 인터페이스 정의
  }
}

const pretendard = localFont({
  src: "../default.ttf",
  weight: "400", // Pretendard는 여러 가중치가 있지만 단일 파일이라 400으로 지정
  style: "normal",
  variable: "--font-pretendard",
  display: "swap"
});

export default async function RootLayout({
  children
}: {
  children: ReactElement; // children의 타입을 명시적으로 ReactElement로 설정
}) {
  const cookieStore = await cookies();
  const userToken = cookieStore.get("DDD-marketing")?.value;
  const role = userToken?.split(",")[3];

  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.min.css"
        />
      </head>
      <body className={`${pretendard.variable} tracking-tighter`}>
        <div className="block lg:hidden">
          <Display />
        </div>

        <div className="hidden lg:block">
          <RoleProvider role={role as Role}>
            <ReactQueryProvider>
              <PopupProvider>
                <ToastProvider>
                  <div className="max-w-full flex flex-col items-center px-5">
                    <Navigation />
                    {children}
                  </div>
                </ToastProvider>
              </PopupProvider>
            </ReactQueryProvider>
          </RoleProvider>
        </div>
      </body>
    </html>
  );
}
