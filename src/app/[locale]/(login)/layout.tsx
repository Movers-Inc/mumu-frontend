import { ReactQueryProvider, PopupProvider, ToastProvider } from "@/providers";

export const metadata = {
  title: "DDD Marketing 서비스 로그인",
  description: "DDD Marketing 서비스 로그인"
};

export default function LoginLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryProvider>
      <PopupProvider>
        <ToastProvider>{children}</ToastProvider>
      </PopupProvider>
    </ReactQueryProvider>
  );
}
