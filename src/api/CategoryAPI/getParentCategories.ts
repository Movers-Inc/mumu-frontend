import { API } from "..";
import { useQuery } from "react-query";
import { Response } from "../types";

export const getParentCategories = async (pid?: number) => {
  const { data } = await API.get<Response<string>>(`/category/path/${pid}`);

  return data;
};

export const useGetParentCategories = (pid?: number) => {
  const query = useQuery(["parent-categories", pid], () =>
    getParentCategories(pid)
  );
  const data = query.data ? query.data.data : undefined;
  return {
    ...query,
    categories: data
  };
};
