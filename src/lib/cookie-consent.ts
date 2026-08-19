const CONSENT_COOKIE = "mumu_cookie_consent";
const CONSENT_MAX_AGE = 60 * 60 * 24 * 180;

export interface CookieConsentState {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  decidedAt: string;
  version: number;
}

const CONSENT_VERSION = 1;

export function getCookieConsent(): CookieConsentState | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${CONSENT_COOKIE}=`));
  if (!match) return null;
  try {
    const parsed = JSON.parse(
      decodeURIComponent(match.split("=")[1])
    ) as CookieConsentState;
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveCookieConsent(
  analytics: boolean,
  marketing: boolean
): CookieConsentState {
  const state: CookieConsentState = {
    necessary: true,
    analytics,
    marketing,
    decidedAt: new Date().toISOString(),
    version: CONSENT_VERSION
  };
  if (typeof document !== "undefined") {
    document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(state))}; path=/; max-age=${CONSENT_MAX_AGE}; SameSite=Lax`;
  }
  return state;
}

export function hasConsentDecision(): boolean {
  return getCookieConsent() !== null;
}

export function canUseAnalytics(): boolean {
  return getCookieConsent()?.analytics === true;
}

export function canUseMarketing(): boolean {
  return getCookieConsent()?.marketing === true;
}
