import { API } from "..";
import { useQuery } from "react-query";
import { BrandListDto } from "@/dtos/brand/BrandList.dto";
import { Pagination, PaginationResponse } from "../types";

interface Params {
  search?: string;
  pagination?: Pagination;
}

export const listBrand = async (params?: Params) => {
  const { search, pagination } = params || {};
  const { data } = await API.get<PaginationResponse<BrandListDto>>("/brand", {
    params: {
      search,
      page: pagination?.page, // 페이지 번호
      size: pagination?.size // 페이지 크기 }
    }
  });

  return data;
};

export const useListBrand = (params?: Params) => {
  const query = useQuery(["list-brand", params], () => listBrand(params));
  const data = query.data ? query.data.data : undefined;
  return {
    ...query,
    brands: data,
    pagination: query.data?.meta?.pagination
  };
};
