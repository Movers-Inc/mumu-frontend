import raiseInView from "./motion/raiseInView";
import showInView from "./motion/showInView";

export { showInView, raiseInView };

// Env
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export const JWT_COOKIE_NAME = process.env.NEXT_PUBLIC_JWT_COOKIE_NAME ?? "";
export const MASTER_JWT_COOKIE_NAME =
  process.env.NEXT_PUBLIC_MASTER_JWT_COOKIE_NAME ?? "";
export const IAMPORT_IDENTITY_CODE =
  process.env.NEXT_PUBLIC_IAMPORT_IDENTITY_CODE ?? "";
export const IAMPORT_REDIRECT_URL =
  process.env.NEXT_PUBLIC_IAMPORT_REDIRECT_URL ?? "";
