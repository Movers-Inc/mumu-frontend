import { NextRequest } from "next/server";
import { JWT } from ".";

// 토큰 저장
export const setTokens = async (
  tokens: JWT | null,
  serverSideRequest?: NextRequest
) => {
  if (serverSideRequest) {
    if (!tokens) {
      serverSideRequest.cookies.set("DDD-marketing", "");
    } else {
      serverSideRequest.cookies.set(
        "DDD-marketing",
        `${tokens.accessToken},${tokens.refreshToken},${tokens.brandId},${tokens.role}`
      );
    }
  } else {
    if (!tokens) {
      await fetch("/api/session/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });

      window.location.href = "/";
    } else {
      const response = await fetch("/api/session/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          brandId: tokens.brandId,
          role: tokens.role
        })
      });
      if (response.status === 200) {
        window.location.href = "/"; // 또는 다른 리다이렉트 로직 추가
      }
    }
  }
};
