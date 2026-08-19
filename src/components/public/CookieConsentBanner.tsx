"use client";

import { FC, useEffect, useState } from "react";
import {
  CookieConsentState,
  getCookieConsent,
  hasConsentDecision,
  saveCookieConsent
} from "@/lib/cookie-consent";
import { useLocale } from "@/providers/LocaleProvider";

const CookieConsentBanner: FC = () => {
  const { t } = useLocale();
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    setVisible(!hasConsentDecision());
    const existing = getCookieConsent();
    if (existing) {
      setAnalytics(existing.analytics);
      setMarketing(existing.marketing);
    }
  }, []);

  const applyConsent = (state: CookieConsentState) => {
    setVisible(false);
    setShowSettings(false);
    setAnalytics(state.analytics);
    setMarketing(state.marketing);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-[200] p-4"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
    >
      <div className="max-w-[960px] mx-auto bg-white border border-[#E2E2E2] shadow-lg rounded-[16px] p-5">
        <h2 id="cookie-consent-title" className="text-[18px] font-bold mb-2">
          {t("cookie.title")}
        </h2>
        <p id="cookie-consent-desc" className="text-[14px] text-[#666] mb-4">
          {t("cookie.description")}
        </p>

        {showSettings && (
          <div className="mb-4 space-y-3 text-[14px]">
            <label className="flex items-center gap-2 text-[#888]">
              <input type="checkbox" checked disabled readOnly />
              {t("cookie.necessary")}
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
              />
              {t("cookie.analytics")}
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
              />
              {t("cookie.marketing")}
            </label>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="bg-[#3129A5] text-white px-4 py-2 rounded-full text-[14px] font-medium"
            onClick={() => applyConsent(saveCookieConsent(true, true))}
          >
            {t("cookie.acceptAll")}
          </button>
          <button
            type="button"
            className="border border-[#E2E2E2] px-4 py-2 rounded-full text-[14px]"
            onClick={() => applyConsent(saveCookieConsent(false, false))}
          >
            {t("cookie.rejectOptional")}
          </button>
          <button
            type="button"
            className="text-[#3129A5] px-4 py-2 text-[14px] font-medium"
            onClick={() => {
              if (showSettings) {
                applyConsent(saveCookieConsent(analytics, marketing));
              } else {
                setShowSettings(true);
              }
            }}
          >
            {showSettings ? t("cookie.save") : t("cookie.settings")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
