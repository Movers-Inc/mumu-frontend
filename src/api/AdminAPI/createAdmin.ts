import { API } from "..";
import { CreateAdminDto } from "@/dtos/admin/CreateAdmin.dto";

export const createAdmin = async (body: CreateAdminDto) => {
  const { data } = await API.post("admin/register", {
    ...body
  });

  return data;
}