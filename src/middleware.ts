import { NextMiddleware, NextRequest, NextResponse } from "next/server";
import { API_URL } from "./constants";
import {
  detectLocaleFromHeader,
  getLocaleFromPathname,
  isLocale,
  stripLocaleFromPathname,
  withLocalePath
} from "@/lib/i18n/routing";
import { LOCALE_COOKIE } from "@/lib/i18n/locale";
import { Locale } from "@/lib/i18n/types";

const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function withLocaleCookie(response: NextResponse, locale: Locale) {
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: "lax"
  });
  return response;
}

const middleware: NextMiddleware = async (request: NextRequest) => {
  const { pathname, origin } = request.nextUrl;

  if (
    ["/api", "/_next", "/favicon.ico"].some((prefix) =>
      pathname.startsWith(prefix)
    )
  ) {
    return NextResponse.next();
  }

  if (
    pathname.includes(".png") ||
    pathname.includes(".svg") ||
    pathname.includes(".gif") ||
    pathname.includes("/fonts")
  ) {
    return NextResponse.next();
  }

  let locale = getLocaleFromPathname(pathname);

  if (!locale) {
    const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
    const preferred = isLocale(cookieLocale)
      ? cookieLocale
      : detectLocaleFromHeader(request.headers.get("accept-language"));

    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = withLocalePath(
      preferred,
      pathname === "/" ? "/" : pathname
    );
    return withLocaleCookie(NextResponse.redirect(redirectUrl), preferred);
  }

  const pathWithoutLocale = stripLocaleFromPathname(pathname);
  const token = request?.cookies?.get("DDD-marketing")?.value;

  let isAuthenticated = false;
  let brand: number = 0;
  let role = token?.split(",")[3];
  let restricted = false;

  if (token) {
    const [accessToken, refreshToken, brandId] = token.split(",");
    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${accessToken} ${refreshToken}` }
      });
      const res = await response.json();

      isAuthenticated = !!res.data?.id;
      brand = parseInt(brandId) ?? 0;

      restricted =
        brand === 1
          ? role === "GENERAL" &&
            (pathWithoutLocale === "/manage/mumu" ||
              pathWithoutLocale === "/manage/mumu/brand/manage")
          : role === "GENERAL" && pathWithoutLocale === "/manage";
    } catch (error) {
      console.error("인증 확인 중 오류 발생:", error);
    }
  }

  if (isAuthenticated === true && restricted === true) {
    return withLocaleCookie(
      NextResponse.redirect(`${origin}${withLocalePath(locale, "/block")}`),
      locale
    );
  }

  if (
    ["/mypage", "/manage"].some((prefix) => pathWithoutLocale.startsWith(prefix))
  ) {
    if (!isAuthenticated) {
      return withLocaleCookie(
        NextResponse.redirect(`${origin}${withLocalePath(locale, "/login")}`),
        locale
      );
    }

    if (brand === 1) {
      if (
        !pathWithoutLocale.includes("mumu") &&
        !pathWithoutLocale.includes("product/analytics")
      ) {
        return withLocaleCookie(
          NextResponse.redirect(
            `${origin}${withLocalePath(locale, `${pathWithoutLocale}/mumu`)}`
          ),
          locale
        );
      }
    }
  }

  return withLocaleCookie(NextResponse.next(), locale);
};

export default middleware;
