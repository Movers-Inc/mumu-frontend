"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo
} from "react";
import { usePathname } from "next/navigation";
import { translate } from "@/lib/i18n/messages";
import { LOCALE_LABELS, persistLocale } from "@/lib/i18n/locale";
import { hrefForLocale, withLocalePath } from "@/lib/i18n/routing";
import { Locale, MessageKey } from "@/lib/i18n/types";

interface LocaleProviderProps {
  children: React.ReactNode;
  locale: Locale;
}

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: MessageKey) => string;
  localeLabels: typeof LOCALE_LABELS;
  localizePath: (path: string) => string;
  hrefForLocale: (next: Locale) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function localeHref(next: Locale, pathname: string) {
  const nextPath = hrefForLocale(next, pathname);
  if (typeof window === "undefined") return nextPath;
  return `${nextPath}${window.location.search}${window.location.hash}`;
}

export function LocaleProvider({ children, locale }: LocaleProviderProps) {
  const pathname = usePathname();

  useEffect(() => {
    persistLocale(locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const hrefForNext = useCallback(
    (next: Locale) => localeHref(next, pathname),
    [pathname]
  );

  const setLocale = useCallback(
    (next: Locale) => {
      if (next === locale) return;
      persistLocale(next);
      window.location.assign(hrefForNext(next));
    },
    [locale, hrefForNext]
  );

  const t = useCallback(
    (key: MessageKey) => translate(locale, key),
    [locale]
  );

  const localizePath = useCallback(
    (path: string) => {
      if (path.startsWith("http")) return path;
      return withLocalePath(locale, path);
    },
    [locale]
  );

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t,
      localeLabels: LOCALE_LABELS,
      localizePath,
      hrefForLocale: hrefForNext
    }),
    [locale, setLocale, t, localizePath, hrefForNext]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
}
