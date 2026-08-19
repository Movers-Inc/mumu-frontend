import { useQuery } from "react-query";
import { API, getTokens } from "..";
import { AdminDto } from "@/dtos/admin/Admin.dto";
import { Response } from "../types";

export const getProfile = async (): Promise<AdminDto | null> => {
  if (!getTokens()?.accessToken) {
    return null;
  }

  try {
    const { data } = await API.get<Response<AdminDto>>("/auth/profile");
    return data.data;
  } catch {
    return null;
  }
};

type UseGetProfileOptions = {
  enabled?: boolean;
};

export const useGetProfile = (options?: UseGetProfileOptions) => {
  const isSignedIn = options?.enabled ?? Boolean(getTokens()?.accessToken);

  const query = useQuery("getMyProfile", getProfile, {
    enabled: isSignedIn,
    retry: false,
    useErrorBoundary: false
  });

  return {
    ...query,
    profile: query.data ?? null
  };
};
