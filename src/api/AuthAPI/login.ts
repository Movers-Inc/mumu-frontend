import { API, JWT, setTokens } from "..";
import { AdminSignInDto } from "@/dtos/auth/AdminSignIn.dto";
import { Response } from "../types";

function isValidJWT(value: unknown): value is JWT {
  return (
    !!value &&
    typeof value === "object" &&
    typeof (value as JWT).accessToken === "string" &&
    typeof (value as JWT).refreshToken === "string" &&
    typeof (value as JWT).brandId === "number" &&
    typeof (value as JWT).role === "string"
  );
}

export const login = async (body: AdminSignInDto) => {
  const { data } = await API.post<Response<JWT>>("/auth/login", {
    ...body
  });

  const payload = data?.data;
  const raw = data as unknown;
  const message =
    typeof (raw as { message?: string })?.message === "string"
      ? (raw as { message: string }).message
      : "로그인에 실패했습니다.";

  if (!isValidJWT(payload)) {
    const err = new Error(message) as Error & {
      response?: { data?: { message?: string } };
    };
    err.response = { data: { message } };
    throw err;
  }

  setTokens(payload);
  return payload;
};
