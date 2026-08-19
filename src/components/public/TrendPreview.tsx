"use client";

import { FC } from "react";
import classNames from "classnames";
import { KeywordRankDto } from "@/dtos/keyword/Rank.dto";
import { useLocale } from "@/providers/LocaleProvider";
import { isSigned } from "@/utils";
import { categories, getCategoryLabel } from "@/constants/category";
import Chevron from "@/app/[locale]/(general)/chevron.svg";

interface TrendPreviewProps {
  activeIndex: number;
  keywordData: KeywordRankDto | null;
  onPrev: () => void;
  onNext: () => void;
}

const TrendPreview: FC<TrendPreviewProps> = ({
  activeIndex,
  keywordData,
  onPrev,
  onNext
}) => {
  const { t, locale, localizePath } = useLocale();
  const viewAllHref = isSigned()
    ? localizePath("/keyword")
    : `${localizePath("/login")}?returnUrl=${encodeURIComponent(localizePath("/keyword"))}`;

  const rawDate = keywordData?.date;
  const basisDate =
    typeof rawDate === "string" && rawDate.length > 0
      ? rawDate.replaceAll("/", ". ")
      : "—";

  return (
    <section className="rounded-[16px] border border-[#E2E2E2] w-full max-w-[600px] mb-5">
      <div className="px-5 pt-4 flex items-center justify-end text-[13px]">
        <a
          href={viewAllHref}
          className="text-[#3129A5] font-medium hover:underline"
        >
          {t("trend.viewAll")}
        </a>
      </div>

      <div className="px-5 mt-3 flex flex-row items-center gap-2 mb-[26px]">
        <button type="button" onClick={onPrev} aria-label="Previous category">
          <Chevron />
        </button>
        <div className="font-bold text-[#000] text-center w-[210px] py-2 bg-[#FFF5E6] text-[24px] rounded-[16px]">
          {`${getCategoryLabel(categories[activeIndex]?.cid ?? "", locale)} ${categories[activeIndex]?.emoji ?? ""}`}
        </div>
        <button
          type="button"
          className="rotate-180"
          onClick={onNext}
          aria-label="Next category"
        >
          <Chevron />
        </button>
      </div>

      <div className="px-10 w-full">
        <div className="w-full flex flex-row justify-between items-end mb-5">
          <div className="text-[24px] font-semibold">{t("trend.title")}</div>
          <div className="text-[14px] text-[#9C9C9C]">
            {t("trend.basisDate")} {basisDate}
          </div>
        </div>

        {keywordData?.ranks?.length ? (
          <div className="grid grid-cols-2 grid-rows-5 gap-y-[18px] text-[16px] mb-11 w-full grid-flow-col">
            {keywordData.ranks.slice(0, 10).map((rankData, index) => (
              <div
                key={`${rankData.keyword}-${index}`}
                className="flex font-medium gap-[10px] whitespace-nowrap w-full"
              >
                <span
                  className={classNames(
                    "font-bold min-w-[24px]",
                    index + 1 < 4 ? "text-[#FF6D6D]" : ""
                  )}
                >
                  {rankData.rank ?? index + 1}
                </span>
                <span
                  className="truncate overflow-hidden text-ellipsis whitespace-nowrap"
                  title={rankData.keyword}
                >
                  {rankData.keyword}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[14px] text-[#9C9C9C] mb-11">
            {t("trend.title")} —
          </p>
        )}
      </div>
    </section>
  );
};

export default TrendPreview;
