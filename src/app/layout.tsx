import "./globals.css";
import localFont from "next/font/local";
import React from "react";

const pretendard = localFont({
  src: "./default.ttf",
  weight: "400",
  style: "normal",
  variable: "--font-pretendard",
  display: "swap"
});

export const metadata = {
  title: "무무 Marketing 서비스 포털",
  description: "무무 Marketing 서비스 포털",
  icons: {
    icon: "/DDD-favicon.ico"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.min.css"
        />
      </head>
      <body className={`${pretendard.variable} tracking-tighter`}>
        {children}
      </body>
    </html>
  );
}
