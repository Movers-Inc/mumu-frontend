import { Locale, MessageKey } from "./types";

const ko: Record<MessageKey, string> = {
  "nav.home": "홈",
  "nav.keyword": "키워드 분석",
  "nav.ads": "광고 소재",
  "nav.manage": "관리",
  "nav.mypage": "마이페이지",
  "header.login": "로그인",
  "header.start": "시작하기",
  "header.logout": "로그아웃",
  "header.goToApp": "앱으로 이동",
  "header.profile": "마이페이지",
  "header.language": "언어",
  "header.country": "국가",
  "hero.title": "글로벌 이커머스 셀러를 위한 통합 마케팅 플랫폼",
  "hero.subtitle":
    "키워드·경쟁사 분석부터 광고 카피·이미지 생성·편집까지 한 곳에서",
  "hero.cta.start": "무료로 시작하기",
  "hero.cta.demo": "데모 문의",
  "hero.flow.analyze": "분석",
  "hero.flow.create": "생성",
  "hero.flow.edit": "편집",
  "search.placeholder": "분석할 키워드를 입력하세요",
  "search.button": "분석",
  "search.error.empty": "키워드를 입력해주세요.",
  "search.error.tooLong": "키워드는 100자 이하로 입력해주세요.",
  "trend.title": "인기 키워드",
  "trend.basisDate": "기준",
  "trend.viewAll": "전체 보기",
  "trend.country": "국가",
  "features.title": "A · B · C 핵심 기능",
  "features.subtitle": "분석 → 생성 → 편집까지 이어지는무마케팅 워크플로",
  "features.a.title": "A. 광고 인사이트",
  "features.a.desc":
    "키워드 가치, 트렌드, 경쟁사 분석으로 광고 전략의 근거를 만듭니다.",
  "features.b.title": "B. 콘텐츠 스튜디오",
  "features.b.desc":
    "캠페인 브리프에서 카피, 배너, 상세페이지를 채널·국가별로 대량 생성합니다.",
  "features.c.title": "C. 이미지 스튜디오",
  "features.c.desc":
    "AI 배경제거, 배경생성, 일러스트, 지우개와 마켓 규정 검증을 지원합니다.",
  "features.cta": "자세히 보기",
  "cookie.title": "쿠키 사용 안내",
  "cookie.description":
    "필수 쿠키는 서비스 제공에 필요합니다. 분석·마케팅 쿠키는 선택이며, 동의 전에는 비필수 추적이 실행되지 않습니다.",
  "cookie.acceptAll": "모두 동의",
  "cookie.rejectOptional": "필수만 허용",
  "cookie.settings": "설정",
  "cookie.necessary": "필수 (항상 활성)",
  "cookie.analytics": "분석",
  "cookie.marketing": "마케팅",
  "cookie.save": "저장"
};

const en: Record<MessageKey, string> = {
  "nav.home": "Home",
  "nav.keyword": "Keyword analytics",
  "nav.ads": "Ad creatives",
  "nav.manage": "Manage",
  "nav.mypage": "My page",
  "header.login": "Log in",
  "header.start": "Get started",
  "header.logout": "Log out",
  "header.goToApp": "Go to app",
  "header.profile": "My page",
  "header.language": "Language",
  "header.country": "Country",
  "hero.title": "All-in-one marketing platform for global e-commerce sellers",
  "hero.subtitle":
    "From keyword & competitor insights to ad copy, creatives, and image editing",
  "hero.cta.start": "Start for free",
  "hero.cta.demo": "Request a demo",
  "hero.flow.analyze": "Analyze",
  "hero.flow.create": "Create",
  "hero.flow.edit": "Edit",
  "search.placeholder": "Enter a keyword to analyze",
  "search.button": "Analyze",
  "search.error.empty": "Please enter a keyword.",
  "search.error.tooLong": "Keyword must be 100 characters or fewer.",
  "trend.title": "Trending keywords",
  "trend.basisDate": "As of",
  "trend.viewAll": "View all",
  "trend.country": "Country",
  "features.title": "Core modules A · B · C",
  "features.subtitle":
    "Analyze → create → edit in one workflow built for multi-region sellers",
  "features.a.title": "A. Ad insights",
  "features.a.desc":
    "Keyword value, trends, and competitor analysis for your ad strategy.",
  "features.b.title": "B. Content studio",
  "features.b.desc":
    "Generate copy, banners, and product pages at scale by channel and locale.",
  "features.c.title": "C. Image studio",
  "features.c.desc":
    "AI background removal, generation, illustration, eraser, and marketplace compliance checks.",
  "features.cta": "Learn more",
  "cookie.title": "Cookie preferences",
  "cookie.description":
    "Necessary cookies are required to run the service. Analytics and marketing cookies are optional and blocked until you consent.",
  "cookie.acceptAll": "Accept all",
  "cookie.rejectOptional": "Necessary only",
  "cookie.settings": "Settings",
  "cookie.necessary": "Necessary (always on)",
  "cookie.analytics": "Analytics",
  "cookie.marketing": "Marketing",
  "cookie.save": "Save"
};

export const messages: Record<Locale, Record<MessageKey, string>> = { ko, en };

export function translate(locale: Locale, key: MessageKey): string {
  return messages[locale][key] ?? messages.en[key] ?? key;
}
