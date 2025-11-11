import styles from "./AnalyticsChartCardSection.module.scss";
import { useMemo } from "react";
import GaugeChart from "@/components/molecules/Chart/GaugeChart/GaugeChart";
import { ProductDetailAnalytics } from "@/dtos/product/analytics/ProductAnalytics.dto";
import { getProductAnalyticsChartScore } from "@/utils/getProductAnalyticsChartScore";

export default function AnalyticsChartCardSection({
  source,
}: {
  source: ProductDetailAnalytics;
}) {
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
  } = useMemo(() => {
    return getProductAnalyticsChartScore(source);
  }, [source]);

  return (
    <div className={styles.container}>
      <GaugeChart
        maxScore={100}
        title="SEO 종합점수"
        width={350}
        height={173}
        pass={scoreCharts.seo.pass}
        count={scoreCharts.seo.count}
      />
      <GaugeChart
        maxScore={100}
        title="프로모션 종합점수"
        width={350}
        height={173}
        pass={scoreCharts.promotion?.pass ?? 0}
        count={scoreCharts.promotion?.count ?? 0}
      />
      <GaugeChart
        maxScore={100}
        title="배송 종합점수"
        width={350}
        height={173}
        pass={scoreCharts.delivery?.pass ?? 0}
        count={scoreCharts.delivery?.count ?? 0}
      />
    </div>
  );
}
