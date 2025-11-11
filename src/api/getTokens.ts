import { NextRequest } from "next/server";
import { JWT } from ".";
import { Role } from "@/dtos/common";
// 토큰 조회
export const getTokens = (serverSideRequest?: NextRequest): JWT | null => {
  let tokens = null;
  if (serverSideRequest) {
    tokens = serverSideRequest?.cookies?.get("DDD-marketing")?.value;
  } else if (typeof document !== "undefined") {
    tokens = document.cookie
      ?.split(";")
      ?.find((row) => row.trim().startsWith(`${"DDD-marketing"}=`))
      ?.split("=")[1];
  }
  if (!tokens) return null;

  if (typeof document !== "undefined" && !serverSideRequest) {
    const [accessToken, refreshToken, brandId, role] = tokens.split("%2C");

    return {
      accessToken,
      refreshToken,
      brandId: Number(brandId),
      role: role as Role
    };
  }

  const [accessToken, refreshToken, brandId, role] = tokens.split(",");
  return {
    accessToken,
    refreshToken,
    brandId: Number(brandId),
    role: role as Role
  };
};
