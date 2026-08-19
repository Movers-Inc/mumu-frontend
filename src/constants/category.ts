export const categories: { cid: string; emoji: string }[] = [
  { cid: "50000000", emoji: "👕" },
  { cid: "50000001", emoji: "🧣" },
  { cid: "50000002", emoji: "💄" },
  { cid: "50000003", emoji: "⌚" },
  { cid: "50000004", emoji: "🪑" },
  { cid: "50000005", emoji: "🍼" },
  { cid: "50000006", emoji: "🥬" },
  { cid: "50000007", emoji: "🏀" },
  { cid: "50000008", emoji: "🏠" },
  { cid: "50000009", emoji: "✈️" },
  { cid: "50000010", emoji: "🛍️" },
  { cid: "50005542", emoji: "📚" }
];

const CATEGORY_LABELS: Record<string, { ko: string; en: string }> = {
  "50000000": { ko: "패션의류", en: "Fashion" },
  "50000001": { ko: "패션잡화", en: "Accessories" },
  "50000002": { ko: "화장품/미용", en: "Beauty" },
  "50000003": { ko: "디지털/가전", en: "Electronics" },
  "50000004": { ko: "가구/인테리어", en: "Home" },
  "50000005": { ko: "출산/육아", en: "Baby" },
  "50000006": { ko: "식품", en: "Food" },
  "50000007": { ko: "스포츠/레저", en: "Sports" },
  "50000008": { ko: "생활/건강", en: "Living" },
  "50000009": { ko: "여가/생활편의", en: "Leisure" },
  "50000010": { ko: "면세점", en: "Duty free" },
  "50005542": { ko: "도서", en: "Books" }
};

export function getCategoryLabel(cid: string, locale: "ko" | "en") {
  const labels = CATEGORY_LABELS[cid];
  if (!labels) return cid;
  return locale === "en" ? labels.en : labels.ko;
}
