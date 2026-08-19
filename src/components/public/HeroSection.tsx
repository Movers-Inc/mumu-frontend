"use client";

import { FC } from "react";
import { useLocale } from "@/providers/LocaleProvider";
import { appendAttributionToUrl } from "@/lib/campaign-attribution";

const HeroSection: FC = () => {
  const { t, localizePath } = useLocale();

  const demoHref = appendAttributionToUrl("https://home.dddmkt.com/contact");

  return (
    <section className="w-full text-center mt-[72px] mb-10 px-4">
      <div className="inline-flex items-center gap-2 text-[14px] text-[#3129A5] font-medium mb-4">
        <span className="px-3 py-1 rounded-full bg-[#F0EEFF]">
          {t("hero.flow.analyze")}
        </span>
        <span className="text-[#9C9C9C]">→</span>
        <span className="px-3 py-1 rounded-full bg-[#FFF5E6]">
          {t("hero.flow.create")}
        </span>
        <span className="text-[#9C9C9C]">→</span>
        <span className="px-3 py-1 rounded-full bg-[#E8F8F0]">
          {t("hero.flow.edit")}
        </span>
      </div>

      <h1 className="text-[40px] leading-tight font-bold text-[#222] mb-4 max-w-[900px] mx-auto">
        {t("hero.title")}
      </h1>
      <p className="text-[18px] text-[#666] mb-8 max-w-[720px] mx-auto">
        {t("hero.subtitle")}
      </p>

      <div className="flex flex-row gap-3 justify-center flex-wrap">
        <a
          href={localizePath("/login")}
          className="bg-[#3129A5] text-white text-[16px] font-semibold px-8 py-3 rounded-full hover:opacity-90"
        >
          {t("hero.cta.start")}
        </a>
        <a
          href={demoHref}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-[#3129A5] text-[#3129A5] text-[16px] font-semibold px-8 py-3 rounded-full hover:bg-[#F8F7FF]"
        >
          {t("hero.cta.demo")}
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
