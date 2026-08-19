"use client";

import { FC } from "react";
import { useLocale } from "@/providers/LocaleProvider";

const FeatureCards: FC = () => {
  const { t, localizePath } = useLocale();

  const cards = [
    {
      key: "a",
      title: t("features.a.title"),
      desc: t("features.a.desc"),
      href: localizePath("/keyword"),
      external: false,
      accent: "border-[#3129A5] bg-[#F8F7FF]"
    },
    {
      key: "b",
      title: t("features.b.title"),
      desc: t("features.b.desc"),
      href: "https://ads.mumumarketing.com/",
      external: true,
      accent: "border-[#FF5E3A] bg-[#FFF8F6]"
    },
    {
      key: "c",
      title: t("features.c.title"),
      desc: t("features.c.desc"),
      href: "https://ads.mumumarketing.com/",
      external: true,
      accent: "border-[#1B9E6A] bg-[#F2FBF6]"
    }
  ] as const;

  return (
    <section className="w-full max-w-[1100px] mt-16 mb-20 px-4">
      <div className="text-center mb-10">
        <h2 className="text-[32px] font-bold text-[#222] mb-3">
          {t("features.title")}
        </h2>
        <p className="text-[16px] text-[#666]">{t("features.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <article
            key={card.key}
            className={`rounded-[20px] border p-6 flex flex-col ${card.accent}`}
          >
            <h3 className="text-[20px] font-bold text-[#222] mb-3">
              {card.title}
            </h3>
            <p className="text-[15px] text-[#555] leading-relaxed flex-1 mb-6">
              {card.desc}
            </p>
            <a
              href={card.href}
              {...(card.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="text-[15px] font-semibold text-[#3129A5] hover:underline w-fit"
            >
              {t("features.cta")} →
            </a>
          </article>
        ))}
      </div>
    </section>
  );
};

export default FeatureCards;
