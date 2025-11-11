import { API } from "..";
import { CreateAdminDto } from "@/dtos/admin/CreateAdmin.dto";

export const updateAdmin = async ( brandId: number, adminData: CreateAdminDto) => {
  const { data } = await API.patch(`admin/update/${brandId}`, {
    ...adminData
  });

  return data;
}