import { Locale, SUPPORTED_LOCALES } from "./types";

export const DEFAULT_LOCALE: Locale = "ko";
export const LOCALE_COOKIE = "mumu_locale";

export function isLocale(value?: string | null): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale);
}

export function getLocaleFromPathname(pathname: string): Locale | null {
  const segment = pathname.split("/").filter(Boolean)[0];
  return isLocale(segment) ? segment : null;
}

/** `/ko/keyword` → `/keyword` */
export function stripLocaleFromPathname(pathname: string): string {
  const locale = getLocaleFromPathname(pathname);
  if (!locale) return pathname;

  const rest = pathname.slice(`/${locale}`.length);
  return rest === "" ? "/" : rest;
}

/** `/keyword` + `ko` → `/ko/keyword` */
export function withLocalePath(locale: Locale, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") return `/${locale}`;
  return `/${locale}${normalized}`;
}

/** `/ko/keyword` + `en` → `/en/keyword` */
export function hrefForLocale(nextLocale: Locale, pathname: string): string {
  return withLocalePath(nextLocale, stripLocaleFromPathname(pathname || "/"));
}

export function detectLocaleFromHeader(
  acceptLanguage: string | null
): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;
  const primary = acceptLanguage.split(",")[0]?.split("-")[0]?.toLowerCase();
  return isLocale(primary) ? primary : DEFAULT_LOCALE;
}
