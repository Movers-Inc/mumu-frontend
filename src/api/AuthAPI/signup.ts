import { API } from "..";
import { CreateAdminDto } from "@/dtos/admin/CreateAdmin.dto";

export const signup = async (body: CreateAdminDto) => {
  const { data } = await API.post("/admin/signup", {
    ...body
  });

  // if (data.data && data.status === "success") {
  //   setTokens(data.data);
  // }
  return data;
};
