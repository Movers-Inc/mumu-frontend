import classNames from "classnames";
import styles from "./ProductInformation.module.scss";
import { format } from "date-fns";
import { ProductDetailAnalytics } from "@/dtos/product/analytics/ProductAnalytics.dto";

interface ProductInformationProps {
  source?: ProductDetailAnalytics;
  className?: string;
}
export const ProductInformation = ({
  source,
  className,
}: ProductInformationProps) => {
  const thumbnailSrc = source?.productDetail?.thumbnail?.trim();

  return (
    <div className={classNames(styles.container, className)}>
      <p className={styles.title}>상품정보</p>
      <div className={styles.content}>
        {thumbnailSrc ? (
          <img
            src={thumbnailSrc}
            width={200}
            height={200}
            alt="상품이미지"
            className={styles.image}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className={styles.imagePlaceholder}>이미지 없음</div>
        )}
        <div className={styles.info}>
          <div className={styles.top}>
            <div className={styles.category}>
              {(() => {
                if (source?.productDetail?.provider === "NAVER") {
                  return `${source?.productDetail?.category?.name} > ${source?.productDetail?.category?.subCategory?.name} > ${source?.productDetail?.category?.subCategory?.subCategory?.name}`;
                }
                return "-";
              })()}
            </div>
            <div className={styles.title}>{source?.productDetail?.name}</div>
            <p className={styles.brand}>{source?.productDetail?.brandName}</p>
          </div>
          <div className={styles.bottom}>
            <div className={styles.left}>
              {source?.seo?.productName?.score && (
                <div className={styles.star}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                      fill="#FF6464"
                    />
                  </svg>
                  <p className={styles.starScore}>
                    {source?.productDetail?.review?.reviewScore?.toFixed(1) ||
                      "-"}
                  </p>
                </div>
              )}
              <div className={styles.review}>
                <p className={styles.reviewTitle}>{`리뷰`}</p>
                <p className={styles.reviewCount}>
                  {(source?.productDetail?.review?.totalReviewCount || 0) > 0
                    ? source?.productDetail?.review?.totalReviewCount?.toLocaleString()
                    : "-"}
                </p>
              </div>
            </div>
            <p className={styles.date}>{`${format(
              source!.analyticsAt!,
              "yyyy.MM.dd"
            )} 기준`}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
