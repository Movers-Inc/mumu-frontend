import { API } from "..";
import { Response } from "../types";
import { ProductDetailAnalytics } from "@/dtos/product/analytics/ProductAnalytics.dto";

export const getProductAnalyticsHistories = async () => {
  const { data } = await API.get<
    Response<{
      items: {
        id: number;
        data: ProductDetailAnalytics;
      }[];
    }>
  >(`/product/analytics/histories`);

  return data?.data?.items || [];
};
