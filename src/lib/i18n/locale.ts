import {
  CountryCode,
  Locale,
  SUPPORTED_LOCALES
} from "./types";

export const LOCALE_COOKIE = "mumu_locale";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function isLocale(value: string | null | undefined): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale);
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const prefix = `${name}=`;
  const match = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((row) => row.startsWith(prefix));
  if (!match) return null;
  return decodeURIComponent(match.slice(prefix.length));
}

export function setCookie(name: string, value: string, maxAge = COOKIE_MAX_AGE) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function getStoredLocale(): Locale {
  const fromCookie = getCookie(LOCALE_COOKIE);
  if (isLocale(fromCookie)) return fromCookie;
  if (typeof navigator === "undefined") return "ko";
  const lang = navigator.language.split("-")[0]?.toLowerCase();
  return isLocale(lang) ? lang : "en";
}

export function persistLocale(locale: Locale) {
  setCookie(LOCALE_COOKIE, locale);
}

export function getCountryForLocale(locale: Locale): CountryCode {
  return locale === "ko" ? "KR" : "US";
}

export const LOCALE_LABELS: Record<Locale, string> = {
  ko: "한국어",
  en: "English"
};

export function parseLocale(value?: string | null): Locale | undefined {
  return isLocale(value) ? value : undefined;
}
