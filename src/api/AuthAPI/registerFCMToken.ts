import { API } from "..";

export const registerFCMToken = async (token: string) => {
  const { data } = await API.post("/auth/fcm/token", {
    token,
  });
  return data;
};
