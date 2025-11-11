import { NextMiddleware, NextRequest, NextResponse } from "next/server";
import { API_URL } from "./constants";

const middleware: NextMiddleware = async (request: NextRequest) => {
  const { pathname, origin } = request.nextUrl;

  // 정적 파일 및 Next.js 시스템 경로 제외
  if (
    ["/api", "/_next", "/favicon.ico"].some((prefix) =>
      pathname.startsWith(prefix)
    )
  )
    return NextResponse.next();

  if (
    pathname.includes(".png") ||
    pathname.includes(".svg") ||
    pathname.includes(".gif") ||
    pathname.includes("/fonts")
  ) {
    return NextResponse.next();
  }

  console.log(pathname);
  const token = request?.cookies?.get("DDD-marketing")?.value;

  let isAuthenticated = false;
  let brand: number = 0;
  let role = token?.split(",")[3];
  let restricted = false;

  // console.debug("token", token);
  if (token) {
    const [accessToken, refreshToken, brandId] = token.split(","); // refreshToken 제거
    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${accessToken} ${refreshToken}` }
      });
      const res = await response.json();

      // console.log(res);
      isAuthenticated = !!res.data?.id; // 사용자가 인증된 경우

      brand = parseInt(brandId) ?? 0;

      restricted =
        brand === 1
          ? role === "GENERAL" &&
            (pathname === "/manage/mumu" ||
              pathname === "/manage/mumu/brand/manage")
          : role === "GENERAL" && pathname === "/manage";
    } catch (error) {
      console.error("인증 확인 중 오류 발생:", error);
    }
  }

  if (isAuthenticated === true && restricted === true) {
    return NextResponse.redirect(`${origin}/block`);
  }

  // 회원 전용 경로 보호
  if (["/mypage", "/manage"].some((prefix) => pathname.startsWith(prefix))) {
    if (!isAuthenticated) {
      return NextResponse.redirect(`${origin}/login`);
    } else {
      if (brand === 1) {
        if (
          !pathname.includes("mumu") &&
          !pathname.includes("product/analytics")
        ) {
          const newPath = `${origin}${pathname}/mumu`;
          return NextResponse.redirect(newPath);
        }
      }
    }
  }

  return NextResponse.next();
};

export default middleware;
