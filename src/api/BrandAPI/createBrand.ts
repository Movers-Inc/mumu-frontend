import { API } from "..";
import { CreateBrandDto } from "@/dtos/brand/CreateBrand.dto";

export const createBrand = async (body: CreateBrandDto) => {
  const { data } = await API.post("/brand/register", {
    ...body
  });

  return data;
};
