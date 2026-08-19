import {
  ReactQueryProvider,
  RoleProvider,
  PopupProvider,
  ToastProvider
} from "@/providers";
import { Navigation } from "@/components/templates";
import { CookieConsentBanner } from "@/components/public";
import { cookies } from "next/headers";
import Display from "@/app/Display";
import React from "react";
import { Role } from "@/dtos/common";

declare global {
  interface UserProps {
    role?: string;
  }
}

export default async function GeneralLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const userToken = cookieStore.get("DDD-marketing")?.value;
  const role = userToken?.split(",")[3];

  return (
    <>
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
                <CookieConsentBanner />
              </ToastProvider>
            </PopupProvider>
          </ReactQueryProvider>
        </RoleProvider>
      </div>
    </>
  );
}
