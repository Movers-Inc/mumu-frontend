import axios from "axios";
import { NextRequest } from "next/server";
import { getTokens } from "./getTokens";

// API 인스턴스 생성
export const getAxiosInstance = (baseURL: string, config = {}) => {
  let _request: NextRequest | undefined = undefined;
  const instance = axios.create({ baseURL, ...config });

  instance.interceptors.request.use(
    (config) => {
      const jwt = getTokens(_request);

      if (jwt && config.headers)
        config.headers["Authorization"] = `Bearer ${jwt.accessToken}`;

      return config;
    },
    (error) => {
      console.error(error);
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (res) => {
      return res;
    },
    async (error) => {
      const errorStatus = error.response?.status;

      if (errorStatus === 401) {
        const tokens = getTokens(_request);
        if (tokens) {
          const { refreshToken } = tokens;

          return refreshToken;
          // 리프레시 토큰 기능 구현 후 사용
          // POST /account/auth/refresh
          // {
          //   "refreshToken": "refreshToken"
          // }

          // const refreshResponse = await axios.postAccessTokenRefresh(
          //   refreshToken
          // );

          // if (refreshResponse.status === 200) {
          //   setTokens(refreshResponse.data);
          //   error.config.headers[
          //     "Authorization"
          //   ] = `Bearer ${refreshResponse.data.accessToken}`;
          //   return await instance.request(error.config); // 원래요청 재발송
          // }
        }
      }

      return Promise.reject(error);
    }
  );

  const setServerSideRequest = (serverSideRequest: NextRequest) => {
    _request = serverSideRequest;
  };
  return { instance, setServerSideRequest };
};
