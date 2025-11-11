import { useEffect, useState } from "react";
import styles from "./AnalyticsResultItem.module.scss";
import {
  getLightScoreColor,
  getScoreChip,
  getScoreColor,
  getScoreMessage,
} from "@/utils/getScoreColor";

export interface AnalyticsResultItemProps {
  source: {
    title: string;
    score: number;
    checklist: { title: string; status: "PASS" | "FAIL" }[];
  };
}

const AnalyticsResultItem = ({ source }: AnalyticsResultItemProps) => {
  const [animatedScore, setAnimatedScore] = useState<number>(0);
  const scoreColor = getScoreColor(source.score);
  const lightScoreColor = getLightScoreColor(source.score);
  const scoreMessage = getScoreMessage(source.score);
  const scoreChip = getScoreChip(source.score);

  useEffect(() => {
    let current = 0;
    const increment = source.score / 50;

    const interval = setInterval(() => {
      current += increment;
      if (current >= source.score) {
        current = source.score;
        clearInterval(interval);
      }
      setAnimatedScore(current);
    }, 15);

    return () => {
      clearInterval(interval);
    };
  }, [source.score]);

  return (
    <div
      className={styles.container}
      style={
        {
          "--score-color": scoreColor,
          "--light-score-color": lightScoreColor,
        } as React.CSSProperties
      }
    >
      <div className={styles.itemHeader}>
        <h3 className={styles.itemTitle}>{source.title}</h3>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="220"
          height="20"
          viewBox="0 0 220 20"
          fill="none"
        >
          <rect width="220" height="20" rx="10" fill="#F0F0F0" />
          <rect
            width={`${(animatedScore / 100) * 220}px`}
            height="20"
            rx="10"
            fill={lightScoreColor}
          />
        </svg>

        <p className={styles.score}>
          <span> {Math.round(animatedScore)}점</span>
          <div className={styles.scoreDivider} />
          <span>{scoreMessage}</span>
        </p>
      </div>

      <div className={styles.chip}>
        <p>{scoreChip}</p>
      </div>

      <ul className={styles.checklist}>
        {source.checklist.map((check, checkIndex) => (
          <li
            key={checkIndex}
            className={`${styles.checkItem} ${
              check.status === "PASS" ? styles.pass : styles.fail
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M18 8L9.75 16.25L6 12.5"
                stroke={check.status === "PASS" ? "#9C9C9C" : "#FF5E3A"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p>{check.title}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnalyticsResultItem;
