const cache = new Map<string, string>();

async function translateOne(text: string): Promise<string> {
  const cached = cache.get(text);
  if (cached) return cached;

  const response = await fetch(
    `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ko&tl=en&dt=t&q=${encodeURIComponent(text)}`
  );
  if (!response.ok) return text;

  const data = await response.json();
  const translated = Array.isArray(data?.[0])
    ? data[0]
        .map((part: unknown) => (Array.isArray(part) ? part[0] : ""))
        .join("")
        .trim()
    : "";

  const value = translated || text;
  cache.set(text, value);
  return value;
}

export async function translateKeywordsToEnglish(
  keywords: string[]
): Promise<string[]> {
  return Promise.all(keywords.map((keyword) => translateOne(keyword)));
}
