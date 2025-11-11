import { API_URL } from "@/constants";
import { getAxiosInstance } from "./getAxiosInstance";
import { setTokens } from "./setTokens";
import { getTokens } from "./getTokens";

// custom api
import AuthAPI from "./AuthAPI";
import BrandAPI from "./BrandAPI";
import AdminAPI from "./AdminAPI";
import AnalyticsAPI from "./AnalyticsAPI";
import CategoryAPI from "./CategoryAPI";

import { Role } from "@/dtos/common";

// Dto
export interface JWT {
  accessToken: string;
  refreshToken: string;
  brandId: number;
  role: Role;
}

export const { instance: API, setServerSideRequest } =
  getAxiosInstance(API_URL);

export {
  setTokens,
  getTokens,
  AuthAPI,
  BrandAPI,
  AdminAPI,
  AnalyticsAPI,
  CategoryAPI
};
