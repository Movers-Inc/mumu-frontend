import { useMutation } from "react-query";
import { API } from "..";

export const deleteBrand = async (id: number) => {
  const { data } = await API.delete(`/brand/delete/${id}`);
  return data;
};

export const useDeleteBrand = () => {
  const mutation = useMutation(deleteBrand);
  return mutation;
};
