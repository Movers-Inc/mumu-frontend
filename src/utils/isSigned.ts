import { getTokens } from "@/api";

const isSigned = (): boolean => {
  const tokens = getTokens();

  if (tokens) return true;

  return false;
};

export default isSigned;
