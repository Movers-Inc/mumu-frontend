import React, { useEffect, useMemo, useState } from "react";
import styles from "./GaugeChart.module.css";
import classNames from "classnames";
import { getScoreColor } from "@/utils/getScoreColor";
interface GaugeChartProps {
  maxScore: number; // 최대 점수
  title: string; // 차트 이름
  width?: number; // SVG 너비
  height?: number; // SVG 높이
  pass: number; // 통과한 개수
  count: number; // 총 개수
}

const GaugeChart: React.FC<GaugeChartProps> = ({
  maxScore = 100,
  width = 350,
  height = 173,
  title,
  pass,
  count,
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  const score = useMemo(() => {
    return Math.floor((pass / count) * 100);
  }, [pass, count]);

  useEffect(() => {
    let current = 0;
    const increment = score / 50; // 애니메이션 단계
    const interval = setInterval(() => {
      current += increment;
      if (current >= score) {
        current = score;
        clearInterval(interval);
      }
      setAnimatedScore(current);
    }, 15); // 속도 조절
    return () => clearInterval(interval);
  }, [score]);

  // 게이지 차트 관련 계산
  const radius = 140; // 반지름 (더 크게 설정)
  const strokeWidth = 30; // 선 두께 (더 두껍게 설정)
  const circumference = Math.PI * radius; // 반원 둘레
  const arcLength = (animatedScore / maxScore) * circumference; // 채워질 길이
  const strokeDashoffset = circumference - arcLength; // 시작 위치 계산

  const scoreColor = count > 0 ? getScoreColor(score) : "#9C9C9C";

  return (
    <div
      className={classNames(
        styles.container,
        score <= 50 && styles.red,
        50 < score && score <= 99 && styles.yellow,
        score === 100 && styles.green
      )}
      style={
        {
          width: `${width}px`,
          textAlign: "center",
          "--score-color": scoreColor,
        } as React.CSSProperties
      }
    >
      <div className={styles.title}>{title}</div>
      <div className={styles.chartContainer}>
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`} // 전체 보기 영역 설정
        >
          {/* 배경 반원 */}
          <path
            d={`
            M ${width / 2 - radius},${height}
            A ${radius},${radius} 0 0,1 ${width / 2 + radius},${height}
          `}
            fill="none"
            stroke="#EDEDED"
            strokeWidth={strokeWidth}
          />
          {/* 점수 반원 */}
          {count > 0 && (
            <path
              d={`
            M ${width / 2 - radius},${height}
            A ${radius},${radius} 0 0,1 ${width / 2 + radius},${height}
          `}
              fill="none"
              stroke={scoreColor}
              strokeWidth={strokeWidth}
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          )}
          {/* 중앙 점수 표시 */}
          {/* <text
          x="50%"
          y="70%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="22px"
          fontWeight="bold"
          fill="#333"
        >
          {Math.round(animatedScore)}점
        </text> */}
        </svg>
        <div className={styles.scoreContainer}>
          <p className={styles.score} style={{ color: scoreColor }}>
            {count > 0 ? `${Math.round(animatedScore)}점` : "-"}
          </p>
          <p className={styles.scoreLabel}>
            {pass}개 충족 / {count}개 항목
          </p>
        </div>
      </div>
      {/* <div style={{ marginTop: 10, fontSize: "16px", fontWeight: "bold" }}>
        {label}
      </div> */}
    </div>
  );
};

export default GaugeChart;
