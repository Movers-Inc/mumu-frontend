interface route {
  name: string;
  href: string;
}

export const navigation: route[] = [
  {
    name: "홈",
    href: "/"
  },
  {
    name: "키워드 분석",
    href: "/keyword"
  },
  {
    name: "상품 분석",
    href: "/product"
  },
  {
    name: "관리",
    href: "/manage"
  },
  {
    name: "마이페이지",
    href: "/mypage"
  }
];
