import "../globals.css";
import { Inter } from "next/font/google";
import { ReactQueryProvider, PopupProvider, ToastProvider } from "@/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DDD Marketing 서비스 로그인",
  description: "DDD Marketing 서비스 로그인",
  icons: {
    icon: "/DDD-favicon.ico" // favicon 경로 추가
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} font-pretendard-regular tracking-tighter`}
      >
        <ReactQueryProvider>
          <PopupProvider>
            <ToastProvider>{children}</ToastProvider>
          </PopupProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
