import { useMutation } from "react-query";
import { API } from "..";

export const deleteAdmin = async (id: number) => {
  const { data } = await API.delete(`/admin/delete/${id}`);
  return data;
};

export const useDeleteAdmin = () => {
  const mutation = useMutation(deleteAdmin);
  return mutation;
};
