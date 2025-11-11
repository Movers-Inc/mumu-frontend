import AnalyticsResultItem from "../../molecules/AnalyticsResultItem/AnalysisResultItem/AnalyticsResultItem";
import styles from "./AnalyticsResultSection.module.scss";

interface AnalyticsResultSectionProps {
  title: string;
  style?: React.CSSProperties;
  items: {
    title: string;
    score: number;
    checklist: {
      title: string;
      status: "PASS" | "FAIL";
    }[];
  }[]; // items를 배열로 수정
}

function AnalyticsResultSection({
  title,
  style,
  items,
}: AnalyticsResultSectionProps) {
  return (
    <div className={styles.container} style={style}>
      <p className={styles.title}>{title}</p>

      <div className={styles.itemsContainer}>
        {items.map((item) => (
          <AnalyticsResultItem source={item} key={item.title} />
        ))}
      </div>
    </div>
  );
}

export default AnalyticsResultSection;
