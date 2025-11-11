import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST(req: NextRequest) {
  const { accessToken, refreshToken, brandId, role } = await req.json();
  // console.debug("로그인 세션 저장:", accessToken, refreshToken);

  // Set the JWT cookie
  const cookieValue = `${accessToken},${refreshToken},${brandId},${role}`;
  const cookie = serialize("DDD-marketing", cookieValue, {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/"
  });

  // Create a new NextResponse instance and set the response headers
  const response = new NextResponse(null, {
    status: 303,
    headers: {
      "Set-Cookie": cookie,
      Location: "/"
    }
  });

  return response;
}
