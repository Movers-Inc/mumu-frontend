import { UpdateBrandDto } from "@/dtos/brand/UpdateBrand.dto";
import { API } from "..";

export const updateBrand = async ( brandId: number, brandData: UpdateBrandDto) => {
  const { data } = await API.patch(`brand/update/${brandId}`, {
    ...brandData
  });

  return data;
}