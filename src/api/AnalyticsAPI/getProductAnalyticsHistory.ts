import { API } from "..";
import { Response } from "../types";
import { ProductDetailAnalytics } from "@/dtos/product/analytics/ProductAnalytics.dto";

export const getProductAnalyticsHistory = async (id: number) => {
  const { data } = await API.get<Response<ProductDetailAnalytics>>(
    `/product/analytics/history/${id}`
  );

  return data?.data;
};
