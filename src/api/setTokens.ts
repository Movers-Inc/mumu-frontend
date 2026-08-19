import { NextRequest } from "next/server";
import { JWT } from ".";
import {
  buildKeywordAnalyticsPath,
  clearKeywordDraft,
  clearReturnUrl,
  getKeywordDraft,
  getReturnUrl
} from "@/lib/keyword-draft";
import { getStoredLocale } from "@/lib/i18n/locale";
import {
  getLocaleFromPathname,
  withLocalePath
} from "@/lib/i18n/routing";

function resolvePostLoginPath(): string {
  const locale = getStoredLocale();
  const draft = getKeywordDraft();
  const returnUrl = getReturnUrl();

  if (draft?.keyword) {
    const path = withLocalePath(locale, buildKeywordAnalyticsPath(draft));
    clearKeywordDraft();
    clearReturnUrl();
    return path;
  }

  if (returnUrl) {
    clearReturnUrl();
    if (getLocaleFromPathname(returnUrl)) return returnUrl;
    return withLocalePath(locale, returnUrl);
  }

  return withLocalePath(locale, "/");
}

export const setTokens = async (
  tokens: JWT | null,
  serverSideRequest?: NextRequest
) => {
  if (serverSideRequest) {
    if (!tokens) {
      serverSideRequest.cookies.set("DDD-marketing", "");
    } else {
      serverSideRequest.cookies.set(
        "DDD-marketing",
        `${tokens.accessToken},${tokens.refreshToken},${tokens.brandId},${tokens.role}`
      );
    }
  } else {
    if (!tokens) {
      await fetch("/api/session/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });

      window.location.href = withLocalePath(getStoredLocale(), "/");
    } else {
      const response = await fetch("/api/session/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          brandId: tokens.brandId,
          role: tokens.role
        })
      });
      if (response.status === 200) {
        window.location.href = resolvePostLoginPath();
      }
    }
  }
};
