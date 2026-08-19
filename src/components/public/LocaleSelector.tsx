"use client";

import { FC, MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { persistLocale } from "@/lib/i18n/locale";
import { hrefForLocale } from "@/lib/i18n/routing";
import { useLocale } from "@/providers/LocaleProvider";
import { Locale, SUPPORTED_LOCALES } from "@/lib/i18n/types";

const LocaleSelector: FC = () => {
  const { locale, t, localeLabels } = useLocale();
  const pathname = usePathname();

  const go = (event: MouseEvent<HTMLAnchorElement>, next: Locale) => {
    event.preventDefault();
    persistLocale(next);
    window.location.href = hrefForLocale(next, pathname);
  };

  return (
    <details className="relative">
      <summary
        className="flex h-9 cursor-pointer list-none items-center rounded-lg px-3 text-[13px] font-medium text-[#444] hover:bg-[#F4F4F8] [&::-webkit-details-marker]:hidden"
        aria-label={t("header.language")}
      >
        {localeLabels[locale]}
      </summary>
      <div className="absolute right-0 top-[calc(100%+6px)] z-[300] w-[168px] rounded-xl border border-[#ECECEC] bg-white py-1 shadow-lg">
        {SUPPORTED_LOCALES.map((code) =>
          code === locale ? (
            <div
              key={code}
              className="bg-[#F8F7FF] px-3 py-2.5 text-[13px] font-semibold text-[#3129A5]"
            >
              {localeLabels[code]}
            </div>
          ) : (
            <a
              key={code}
              href={hrefForLocale(code, pathname)}
              hrefLang={code}
              className="block px-3 py-2.5 text-[13px] font-medium text-[#222] hover:bg-[#F6F6F6]"
              onClick={(event) => go(event, code)}
            >
              {localeLabels[code]}
            </a>
          )
        )}
      </div>
    </details>
  );
};

export default LocaleSelector;
