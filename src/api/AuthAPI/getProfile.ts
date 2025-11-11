import { useQuery } from "react-query";
import { API } from "..";
import { AdminDto } from "@/dtos/admin/Admin.dto";
import { Response } from "../types";

export const getProfile = async () => {
  const { data } = await API.get<Response<AdminDto>>("/auth/profile");

  return data.data;
};

export const useGetProfile = () => {
  const query = useQuery("getMyProfile", getProfile, {
    retry: false, // 재시도 비활성화
    onError: () => {
      return null;
    }
  });

  // 프로필 상태 반환
  const profile = query.isError ? null : query.data;

  return {
    ...query,
    profile
  };
};
