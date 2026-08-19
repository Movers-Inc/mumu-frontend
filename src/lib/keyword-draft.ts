import { CountryCode } from "./i18n/types";

const DRAFT_KEY = "mumu_keyword_draft";
const RETURN_URL_KEY = "mumu_return_url";
const MAX_KEYWORD_LENGTH = 100;

const FORBIDDEN_KEYWORDS = ["script", "<", ">"];

export interface KeywordDraft {
  keyword: string;
  country: CountryCode;
  cid?: string;
  date?: string;
  savedAt: string;
}

export function validateKeyword(keyword: string): string | null {
  const trimmed = keyword.trim();
  if (!trimmed) return "empty";
  if (trimmed.length > MAX_KEYWORD_LENGTH) return "tooLong";
  const lower = trimmed.toLowerCase();
  if (FORBIDDEN_KEYWORDS.some((word) => lower.includes(word))) {
    return "forbidden";
  }
  return null;
}

export function saveKeywordDraft(draft: Omit<KeywordDraft, "savedAt">) {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem(
    DRAFT_KEY,
    JSON.stringify({ ...draft, savedAt: new Date().toISOString() })
  );
}

export function getKeywordDraft(): KeywordDraft | null {
  if (typeof sessionStorage === "undefined") return null;
  const raw = sessionStorage.getItem(DRAFT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as KeywordDraft;
  } catch {
    return null;
  }
}

export function clearKeywordDraft() {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.removeItem(DRAFT_KEY);
}

export function saveReturnUrl(url: string) {
  if (typeof sessionStorage === "undefined") return;
  if (!url.startsWith("/")) return;
  sessionStorage.setItem(RETURN_URL_KEY, url);
}

export function getReturnUrl(): string | null {
  if (typeof sessionStorage === "undefined") return null;
  const url = sessionStorage.getItem(RETURN_URL_KEY);
  return url?.startsWith("/") ? url : null;
}

export function clearReturnUrl() {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.removeItem(RETURN_URL_KEY);
}

export function buildKeywordAnalyticsPath(
  draft: Pick<KeywordDraft, "keyword" | "cid" | "date">
): string {
  const cid = draft.cid ?? "50000000";
  const date = draft.date ?? new Date().toISOString().slice(0, 10);
  return `/keyword/analytics/${encodeURIComponent(draft.keyword)}?cid=${cid}&date=${date}`;
}
