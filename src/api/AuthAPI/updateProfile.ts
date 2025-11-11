import { useMutation, useQueryClient } from "react-query";
import { API } from "..";

interface updateProfileDto {
  password?: string;
  passwordc?: string;
  email: string;
  phone: string;
}

export const updateProfile = async (profileData: updateProfileDto) => {
  const { data } = await API.patch("/admin/profile/me", { ...profileData });
  return data;
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation(updateProfile, {
    onSuccess: () => {
      // 프로필 데이터가 업데이트된 후 캐시 무효화
      queryClient.invalidateQueries("getMyProfile");
    },
  });
};
