import { API } from "..";
import { useQuery } from "react-query";
import { CategoryDto } from "@/dtos/category.dto";
import { Pagination, Response } from "../types";

export const listCategories = async (pid?: number) => {
  const { data } = await API.get<Response<CategoryDto[]>>(`/category/${pid}`);

  return data;
};

export const useListCategories = (pid?: number) => {
  const query = useQuery(["list-categories", pid], () => listCategories(pid));
  const data = query.data ? query.data.data : undefined;
  return {
    ...query,
    categories: data
  };
};
