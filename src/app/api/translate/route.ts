import { NextResponse } from "next/server";
import { translateKeywordsToEnglish } from "@/lib/i18n/translate-keywords";

export async function POST(request: Request) {
  const body = await request.json();
  const texts = Array.isArray(body?.texts) ? body.texts.map(String) : [];
  const translated = await translateKeywordsToEnglish(texts);
  return NextResponse.json({ translated });
}
