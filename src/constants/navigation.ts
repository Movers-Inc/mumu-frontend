import { MessageKey } from "@/lib/i18n/types";

export interface NavigationItem {
  key: MessageKey;
  href: string;
}

export const navigation: NavigationItem[] = [
  { key: "nav.home", href: "/" },
  { key: "nav.keyword", href: "/keyword" },
  { key: "nav.ads", href: "https://ads.mumumarketing.com/" },
  { key: "nav.manage", href: "/manage" },
  { key: "nav.mypage", href: "/mypage" }
];
