import { notFound } from "next/navigation";
import { LocaleProvider } from "@/providers";
import { isLocale } from "@/lib/i18n/routing";
import { SUPPORTED_LOCALES } from "@/lib/i18n/types";

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <LocaleProvider locale={locale}>{children}</LocaleProvider>;
}
