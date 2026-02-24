import classNames from "classnames";
import styles from "./KeywordClickAnalyticsSection.module.scss";
import Chart from "@/app/(general)/keyword/analytics/Chart";
import { useMemo, useState } from "react";
import { AnalyticsAPI } from "@/api";
import { useGetKeywordRank } from "@/api/AnalyticsAPI/getKeywordRank";
import { useRouter } from "next/navigation";
import { ProductDetailAnalytics } from "@/dtos/product/analytics/ProductAnalytics.dto";

interface KeywordClickAnalyticsSectionProps {
  source: ProductDetailAnalytics;
  className?: string;
}

export const KeywordClickAnalyticsSection = ({
  source,
  className,
}: KeywordClickAnalyticsSectionProps) => {
  const hasCategoryId = !!source?.productDetail?.category?.subCategory?.subCategory?.id;

  const displayCategory = useMemo(() => {
    if (source?.productDetail?.provider === "NAVER" && source?.productDetail?.category?.name) {
      return `${source.productDetail.category.name}${source.productDetail.category.subCategory ? ` > ${source.productDetail.category.subCategory.name}` : ""}${source.productDetail.category.subCategory?.subCategory ? ` > ${source.productDetail.category.subCategory.subCategory.name}` : ""}`;
    }
    return "";
  }, [source]);

  const { data: keywordRankData } = AnalyticsAPI.useGetWeekRank(
    source.productDetail.category?.subCategory?.subCategory?.id ?? "",
    {
      enabled: hasCategoryId,
    }
  );

  const [activeRank, setActiveRank] = useState<number>(0);

  const router = useRouter();

  return (
    <div className={classNames(styles.container, className)}>
      <p className={styles.title}>
        {hasCategoryId ? (
          <>
            최근 7일 <span style={{ color: "#FF5E3A" }}>{displayCategory}</span>
            {" "}카테고리 TOP 5 키워드 클릭량
          </>
        ) : (
          "카테고리 정보가 없어 키워드 클릭량을 표시할 수 없습니다."
        )}
      </p>
      <div className={styles.content}>
        {!hasCategoryId && source?.productDetail?.provider === "NAVER" ? (
          <div className={styles.blocked}>
            <p className={styles.blockedText}>
              상품 카테고리 정보가 없어
              <br />
              키워드 클릭량을 표시할 수 없습니다.
            </p>
          </div>
        ) : (
          <>
        <div className={styles.rankList}>
          {keywordRankData?.data
            ?.slice(0, 5)
            .map((item: any, index: number) => (
              <button
                className={classNames(styles.rankItem, {
                  [styles.active]: activeRank === index,
                })}
                key={index}
                onClick={() => setActiveRank(index)}
              >
                <p className={styles.rankItemNumber}>{index + 1}</p>
                <p className={styles.rankItemKeyword}>
                  {item.keyword.length > 5
                    ? `${item.keyword.slice(0, 5)}...`
                    : item.keyword}
                </p>
              </button>
            ))}
        </div>
        <Chart
          data={
            keywordRankData && keywordRankData?.data?.length > 0
              ? keywordRankData?.data[activeRank]?.absClicks
              : []
          }
          date={new Date()}
          label=" "
          unit="회"
          theme="click"
          type="day"
          height={216}
          className={styles.chart}
          tickFill="#9C9C9C"
        />
          </>
        )}
      </div>

      {source.productDetail.provider === "IMWEB" && (
        <div className={styles.blocked}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="22"
            viewBox="0 0 32 22"
            fill="none"
          >
            <path
              d="M32 20.8752L28.7117 16.7623C30.1683 15.0868 31.0069 13.1139 31.0069 11.0026C31.0069 4.92716 24.0662 0 15.5034 0C6.94069 0 0 4.92716 0 11C0 17.0728 6.94069 22 15.5034 22C19.0786 22 22.3669 21.1388 24.9931 19.6956V19.7008L32 20.8726V20.8752Z"
              fill="#FAFAFA"
            />
            <path
              d="M5.3357 12.3165L5.72839 11.4533C6.15045 11.7579 6.78169 11.9719 7.38357 11.9719C8.06987 11.9719 8.35246 11.747 8.35246 11.4424C8.35246 10.5139 5.43479 11.1522 5.43479 9.30973C5.43479 8.46828 6.12109 7.76465 7.54872 7.76465C8.17997 7.76465 8.82589 7.91335 9.29199 8.20351L8.93232 9.07398C8.46623 8.81284 7.98546 8.68589 7.54138 8.68589C6.85509 8.68589 6.58718 8.93978 6.58718 9.2517C6.58718 10.1657 9.50485 9.5346 9.50485 11.3553C9.50485 12.1859 8.81121 12.8932 7.37623 12.8932C6.57984 12.8932 5.7761 12.661 5.33203 12.3201L5.3357 12.3165Z"
              fill="#9C9C9C"
            />
            <path
              d="M9.94141 10.8985C9.94141 9.75234 10.8369 8.93628 12.0627 8.93628C13.2885 8.93628 14.1766 9.75234 14.1766 10.8985C14.1766 12.0446 13.2885 12.8606 12.0627 12.8606C10.8369 12.8606 9.94141 12.0446 9.94141 10.8985ZM13.0426 10.8985C13.0426 10.2384 12.6205 9.84302 12.059 9.84302C11.4975 9.84302 11.0681 10.2384 11.0681 10.8985C11.0681 11.5586 11.4975 11.9539 12.059 11.9539C12.6205 11.9539 13.0426 11.5586 13.0426 10.8985Z"
              fill="#9C9C9C"
            />
            <path
              d="M17.3108 8.93628V9.95545C17.2191 9.9482 17.1457 9.94094 17.0613 9.94094C16.4447 9.94094 16.0373 10.2746 16.0373 11.0036V12.8026H14.918V8.99068H15.9859V9.49483C16.2575 9.12488 16.7163 8.93628 17.3108 8.93628Z"
              fill="#9C9C9C"
            />
            <path
              d="M20.3694 8.93628V9.95545C20.2777 9.9482 20.2043 9.94094 20.1199 9.94094C19.5033 9.94094 19.0959 10.2746 19.0959 11.0036V12.8026H17.9766V8.99068H19.0445V9.49483C19.3161 9.12488 19.7749 8.93628 20.3694 8.93628Z"
              fill="#9C9C9C"
            />
            <path
              d="M25.0007 8.99431L23.2575 13.0384C22.8831 13.9596 22.3547 14.2353 21.6573 14.2353C21.2647 14.2353 20.8316 14.1083 20.582 13.8871L20.9894 13.1C21.1619 13.2487 21.3968 13.3394 21.6206 13.3394C21.9289 13.3394 22.1014 13.2052 22.2519 12.8643L22.2666 12.828L20.5967 8.98706H21.7491L22.8318 11.5731L23.9218 8.98706H24.9971L25.0007 8.99431Z"
              fill="#9C9C9C"
            />
            <path
              d="M25.293 12.215C25.293 11.8523 25.5792 11.5839 25.9793 11.5839C26.3793 11.5839 26.6656 11.8523 26.6656 12.215C26.6656 12.5777 26.3793 12.8606 25.9793 12.8606C25.5792 12.8606 25.293 12.5704 25.293 12.215ZM25.315 7.84448H26.6472L26.4233 11.0834H25.5352L25.3113 7.84448H25.315Z"
              fill="#9C9C9C"
            />
          </svg>
          <p className={styles.blockedText}>
            아임웹 스토어는 상품 카테고리별
            <br />
            클릭량을 제공하지 않습니다.
          </p>
        </div>
      )}

      {source.productDetail.provider === "NAVER" &&
        hasCategoryId &&
        (!keywordRankData ||
          !keywordRankData?.data ||
          keywordRankData?.data?.length === 0) && (
          <div className={styles.blocked}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="22"
              viewBox="0 0 32 22"
              fill="none"
            >
              <path
                d="M32 20.8752L28.7117 16.7623C30.1683 15.0868 31.0069 13.1139 31.0069 11.0026C31.0069 4.92716 24.0662 0 15.5034 0C6.94069 0 0 4.92716 0 11C0 17.0728 6.94069 22 15.5034 22C19.0786 22 22.3669 21.1388 24.9931 19.6956V19.7008L32 20.8726V20.8752Z"
                fill="#FAFAFA"
              />
              <path
                d="M5.3357 12.3165L5.72839 11.4533C6.15045 11.7579 6.78169 11.9719 7.38357 11.9719C8.06987 11.9719 8.35246 11.747 8.35246 11.4424C8.35246 10.5139 5.43479 11.1522 5.43479 9.30973C5.43479 8.46828 6.12109 7.76465 7.54872 7.76465C8.17997 7.76465 8.82589 7.91335 9.29199 8.20351L8.93232 9.07398C8.46623 8.81284 7.98546 8.68589 7.54138 8.68589C6.85509 8.68589 6.58718 8.93978 6.58718 9.2517C6.58718 10.1657 9.50485 9.5346 9.50485 11.3553C9.50485 12.1859 8.81121 12.8932 7.37623 12.8932C6.57984 12.8932 5.7761 12.661 5.33203 12.3201L5.3357 12.3165Z"
                fill="#9C9C9C"
              />
              <path
                d="M9.94141 10.8985C9.94141 9.75234 10.8369 8.93628 12.0627 8.93628C13.2885 8.93628 14.1766 9.75234 14.1766 10.8985C14.1766 12.0446 13.2885 12.8606 12.0627 12.8606C10.8369 12.8606 9.94141 12.0446 9.94141 10.8985ZM13.0426 10.8985C13.0426 10.2384 12.6205 9.84302 12.059 9.84302C11.4975 9.84302 11.0681 10.2384 11.0681 10.8985C11.0681 11.5586 11.4975 11.9539 12.059 11.9539C12.6205 11.9539 13.0426 11.5586 13.0426 10.8985Z"
                fill="#9C9C9C"
              />
              <path
                d="M17.3108 8.93628V9.95545C17.2191 9.9482 17.1457 9.94094 17.0613 9.94094C16.4447 9.94094 16.0373 10.2746 16.0373 11.0036V12.8026H14.918V8.99068H15.9859V9.49483C16.2575 9.12488 16.7163 8.93628 17.3108 8.93628Z"
                fill="#9C9C9C"
              />
              <path
                d="M20.3694 8.93628V9.95545C20.2777 9.9482 20.2043 9.94094 20.1199 9.94094C19.5033 9.94094 19.0959 10.2746 19.0959 11.0036V12.8026H17.9766V8.99068H19.0445V9.49483C19.3161 9.12488 19.7749 8.93628 20.3694 8.93628Z"
                fill="#9C9C9C"
              />
              <path
                d="M25.0007 8.99431L23.2575 13.0384C22.8831 13.9596 22.3547 14.2353 21.6573 14.2353C21.2647 14.2353 20.8316 14.1083 20.582 13.8871L20.9894 13.1C21.1619 13.2487 21.3968 13.3394 21.6206 13.3394C21.9289 13.3394 22.1014 13.2052 22.2519 12.8643L22.2666 12.828L20.5967 8.98706H21.7491L22.8318 11.5731L23.9218 8.98706H24.9971L25.0007 8.99431Z"
                fill="#9C9C9C"
              />
              <path
                d="M25.293 12.215C25.293 11.8523 25.5792 11.5839 25.9793 11.5839C26.3793 11.5839 26.6656 11.8523 26.6656 12.215C26.6656 12.5777 26.3793 12.8606 25.9793 12.8606C25.5792 12.8606 25.293 12.5704 25.293 12.215ZM25.315 7.84448H26.6472L26.4233 11.0834H25.5352L25.3113 7.84448H25.315Z"
                fill="#9C9C9C"
              />
            </svg>
            <p className={styles.blockedText}>
              이 카테고리는
              <br />
              클릭량을 제공하지 않습니다.
            </p>
            <button
              className={styles.blockedButton}
              onClick={() => {
                router.push("https://www.naver.com");
              }}
            >
              카테고리 신청하기 →
            </button>
          </div>
        )}
    </div>
  );
};
