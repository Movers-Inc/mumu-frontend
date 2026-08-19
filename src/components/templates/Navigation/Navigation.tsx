"use client";

import { FC } from "react";
import { usePathname } from "next/navigation";
import classNames from "classnames";
import Logo from "./logo.svg";
import { navigation } from "@/constants/navigation";
import { AuthAPI } from "@/api";
import { LocaleSelector } from "@/components/public";
import { useLocale } from "@/providers/LocaleProvider";
import { stripLocaleFromPathname } from "@/lib/i18n/routing";
import { isSigned } from "@/utils";

interface NavigationProps {
  className?: string;
}

const Navigation: FC<NavigationProps> = ({ className }) => {
  const { t, localizePath } = useLocale();
  const signedIn = isSigned();
  const pathname = usePathname();
  const pathWithoutLocale = stripLocaleFromPathname(pathname);

  const { profile, isLoading, isError } = AuthAPI.useGetProfile({
    enabled: signedIn
  });

  const ready = !isLoading || isError;

  return (
    <>
      <div className="h-16" />
      <header
        className={classNames(
          "fixed top-0 left-0 z-[200] w-full overflow-visible bg-white border-b border-[#EEEEEE]",
          className
        )}
      >
        <div className="mx-auto grid h-16 max-w-[1440px] grid-cols-3 items-center px-6">
          <div className="flex justify-start">
            <a href={localizePath("/")} className="shrink-0">
              <Logo width={132} height={26} />
            </a>
          </div>

          <nav className="flex items-center justify-center gap-8" aria-label="Main">
            {navigation.map((item) => {
              const external = item.href.startsWith("http");
              const href = external ? item.href : localizePath(item.href);
              const active =
                (pathWithoutLocale === "/" && item.href === "/") ||
                (!external &&
                  item.href !== "/" &&
                  pathWithoutLocale.startsWith(item.href));

              return (
                <a
                  key={item.key}
                  href={href}
                  className={classNames(
                    "shrink-0 text-[14px]",
                    active
                      ? "font-semibold text-[#3129A5]"
                      : "font-medium text-[#666] hover:text-[#222]"
                  )}
                  {...(external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {t(item.key)}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center justify-end gap-2">
            <LocaleSelector />
            {ready && profile ? (
              <>
                <a
                  href={localizePath("/mypage")}
                  className="h-9 px-4 rounded-full border border-[#3129A5] text-[13px] font-medium text-[#3129A5] leading-9"
                >
                  {t("header.profile")}
                </a>
                <button
                  type="button"
                  className="h-9 px-2 text-[13px] text-[#888] hover:text-[#222]"
                  onClick={() => AuthAPI.logout()}
                >
                  {t("header.logout")}
                </button>
              </>
            ) : ready ? (
              <>
                <a
                  href={localizePath("/login")}
                  className="h-9 px-3 text-[13px] font-medium text-[#3129A5] leading-9"
                >
                  {t("header.login")}
                </a>
                <a
                  href={localizePath("/login")}
                  className="h-9 px-4 rounded-full bg-[#3129A5] text-[13px] font-medium text-white leading-9"
                >
                  {t("header.start")}
                </a>
              </>
            ) : null}
          </div>
        </div>
      </header>
    </>
  );
};

export default Navigation;
