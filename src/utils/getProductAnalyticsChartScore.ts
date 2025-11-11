import { ProductDetailAnalytics } from "@/dtos/product/analytics/ProductAnalytics.dto";
import { useMemo } from "react";

export const getProductAnalyticsChartScore = (
  source: ProductDetailAnalytics
) => {
  const scoreCharts: {
    seo: {
      count: number;
      pass: number;
    };
    promotion?: {
      count: number;
      pass: number;
    };
    delivery?: {
      count: number;
      pass: number;
    };
  } = {
    seo: {
      count: Object.entries(source.seo).reduce((acc, [, value]) => {
        return acc + value.checklist.length;
      }, 0),
      pass: Object.entries(source.seo).reduce((acc, [, value]) => {
        return (
          acc + value.checklist.filter((item) => item.status === "PASS").length
        );
      }, 0),
    },
    promotion:
      source.promotion && source.productDetail.provider === "NAVER"
        ? {
            count: Object.entries(source.promotion).reduce((acc, [, value]) => {
              return acc + value.checklist.length;
            }, 0),
            pass: Object.entries(source.promotion).reduce((acc, [, value]) => {
              return (
                acc +
                value.checklist.filter((item) => item.status === "PASS").length
              );
            }, 0),
          }
        : undefined,
    delivery:
      source.delivery && source.productDetail.provider === "NAVER"
        ? {
            count: Object.entries(source.delivery).reduce((acc, [, value]) => {
              return acc + value.checklist.length;
            }, 0),
            pass: Object.entries(source.delivery).reduce((acc, [, value]) => {
              return (
                acc +
                value.checklist.filter((item) => item.status === "PASS").length
              );
            }, 0),
          }
        : undefined,
  };

  return scoreCharts;
};
