import { API } from "..";
import { useQuery } from "react-query";
import { BrandDto } from "@/dtos/brand/Brand.dto";
import { Response } from "../types";

export const getBrand = async (id: number) => {
  const { data } = await API.get<Response<BrandDto>>(`/brand/${id}`);

  return data.data;
};

export const useGetBrand = (id: number) => {
  const query = useQuery(["brand", id], () => getBrand(id));

  const brandProfile = query.data;
  return {
    ...query,
    brandProfile
  };
};

export const getBrandProfile = async () => {
  const { data } = await API.get("/brand/profile/me");
  // console.log("data: ", data);

  return data;
};

export const useGetBrandProfile = () => {
  const query = useQuery(["brand-profile"], () => getBrandProfile());

  const brandProfile = query.data;
  return {
    ...query,
    brandProfile
  };
};
