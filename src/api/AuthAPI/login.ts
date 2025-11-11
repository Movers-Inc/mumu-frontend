import { API, JWT, setTokens } from "..";
import { AdminSignInDto } from "@/dtos/auth/AdminSignIn.dto";
import { Response } from "../types";

export const login = async (body: AdminSignInDto) => {
  const { data } = await API.post<Response<JWT>>("/auth/login", {
    ...body
  });

  // console.log(data.data);
  if (data.data) {
    setTokens(data.data);
  }

  return data.data;
};
