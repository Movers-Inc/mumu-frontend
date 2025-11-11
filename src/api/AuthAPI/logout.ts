import { setTokens } from "..";

export const logout = async () => {
  setTokens(null);
};
