import { API } from "..";
import { useQuery } from "react-query";
import { AdminListDto } from "@/dtos/admin/AdminList.dto";
import { Pagination, PaginationResponse } from "../types";

interface Params {
  search?: string;
  pagination?: Pagination;
}

export const listAdmin = async (params?: Params) => {
  const { search, pagination } = params || {};
  const { data } = await API.get<PaginationResponse<AdminListDto>>("/admin", {
    params: { search, pagination }
  });

  return data;
}

export const useListAdmin = (params?: Params) => {
  const query = useQuery(["list-admin", params], () => listAdmin(params));
  const data = query.data ? query.data.data : undefined;
  return {
    ...query,
    admins: data,
    pagination: query.data?.meta?.pagination
  };
}