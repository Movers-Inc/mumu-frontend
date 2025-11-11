import { API } from "..";
import { Response } from "../types";
import { ProductDetailAnalytics } from "@/dtos/product/analytics/ProductAnalytics.dto";

export const getProductAnalytics = async (url: string) => {
  const { data } = await API.post<Response<ProductDetailAnalytics>>(
    `/product/analytics`,
    {
      url,
    }
  );

  return data?.data;
};
