import { API } from "..";

export const validatePassword = async (password: string) => {
  const data = await API.post(`/auth/admin/password/validate`, { password });
  return data;
};