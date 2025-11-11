import { API } from ".."
import { useQuery } from "react-query"
import { AdminDto } from "@/dtos/admin/Admin.dto"
import { Response } from "../types"

export const getAdmin = async (id: number) => {
  const { data } = await API.get<Response<AdminDto>>(`/admin/${id}`);

  return data;
}
export const useGetAdmin = (id: number) => {
  const query = useQuery(["admin", id], () => getAdmin(id));

  const adminProfile = query.data;
  return {
    ...query,
    adminProfile,
  };
};