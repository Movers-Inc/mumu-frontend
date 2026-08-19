"use client";

import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import classNames from "classnames";
import MagnifierImage from "@/components/atoms/SearchInput/magnifier.svg";
import { useLocale } from "@/providers/LocaleProvider";
import { useToast } from "@/providers";
import { isSigned } from "@/utils";
import { getCountryForLocale } from "@/lib/i18n/locale";
import {
  buildKeywordAnalyticsPath,
  saveKeywordDraft,
  saveReturnUrl,
  validateKeyword
} from "@/lib/keyword-draft";

const QuickKeywordSearch: FC<{ className?: string }> = ({ className }) => {
  const { t, locale, localizePath } = useLocale();
  const { showToast } = useToast();
  const router = useRouter();
  const [keyword, setKeyword] = useState("");

  const handleSearch = () => {
    const error = validateKeyword(keyword);
    if (error === "empty") {
      showToast(t("search.error.empty"));
      return;
    }
    if (error === "tooLong") {
      showToast(t("search.error.tooLong"));
      return;
    }
    if (error) return;

    const trimmed = keyword.trim();
    const draft = {
      keyword: trimmed,
      country: getCountryForLocale(locale),
      cid: "50000000",
      date: new Date().toISOString().slice(0, 10)
    };
    saveKeywordDraft(draft);

    const analyticsPath = localizePath(buildKeywordAnalyticsPath(draft));

    if (!isSigned()) {
      saveReturnUrl(analyticsPath);
      router.push(
        `${localizePath("/login")}?returnUrl=${encodeURIComponent(analyticsPath)}`
      );
      return;
    }

    router.push(analyticsPath);
  };

  return (
    <div className={classNames("relative w-full max-w-[600px]", className)}>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
        className="w-full border border-[#E2E2E2] bg-white py-[13px] text-[16px] pl-[52px] pr-[120px] outline-none rounded-[50px] placeholder:text-[#9C9C9C]"
        placeholder={t("search.placeholder")}
        maxLength={100}
        aria-label={t("search.placeholder")}
      />
      <div className="absolute top-1/2 left-4 -translate-y-1/2 pointer-events-none">
        <MagnifierImage />
      </div>
      <button
        type="button"
        className="absolute top-1/2 right-2 -translate-y-1/2 text-white bg-[#FF5E3A] rounded-[50px] text-[16px] px-[26px] py-2"
        onClick={handleSearch}
      >
        {t("search.button")}
      </button>
    </div>
  );
};

export default QuickKeywordSearch;
