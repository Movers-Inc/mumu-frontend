"use client";
import React, { useMemo, useState } from "react";
import { NextPage } from "next";
import { AgGridReact } from "ag-grid-react";
import { SubNavigation } from "@/components/templates";
import styles from "./PrductAnalytics.module.scss";
import classNames from "classnames";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useQuery } from "react-query";
import { AnalyticsAPI } from "@/api";
import { ColDef } from "ag-grid-community";
import { ProductDetailAnalytics } from "@/dtos/product/analytics/ProductAnalytics.dto";
import { getProductAnalyticsChartScore } from "@/utils/getProductAnalyticsChartScore";
import { format } from "date-fns";
import Link from "next/link";
import dynamic from "next/dynamic";
import animationData from "@/components/organisms/KeywordTable/animation.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const HomePage: NextPage = () => {
  const { data } = useQuery("AnalyticsAPI.getProductAnalyticsHistories", () =>
    AnalyticsAPI.getProductAnalyticsHistories()
  );

  const columnDefs: ColDef<{
    id: number;
    data: ProductDetailAnalytics;
  }>[] = [
    {
      field: "data.analyticsAt",
      headerName: "분석일자",
      unSortIcon: true,
      sortable: true,
      width: 150,
      cellStyle: { border: "none" },
      cellRenderer: (params: {
        data: {
          id: number;
          data: ProductDetailAnalytics;
        };
      }) => {
        return format(params.data?.data?.analyticsAt, "yyyy-MM-dd HH:mm");
      },
    },
    {
      colId: "productName",
      field: "data.productDetail.name",
      headerName: "상품명",
      unSortIcon: true,
      sortable: true,
      flex: 1,
      cellStyle: { border: "none" },
      cellRenderer: (params: {
        data: {
          id: number;
          data: ProductDetailAnalytics;
        };
      }) => {
        return (
          <Link
            href={`/product?historyId=${params.data?.id}`}
            className={styles.hyperlink}
          >
            {params.data?.data?.productDetail?.name}
          </Link>
        );
      },
    },
    {
      headerName: "카테고리",
      sortable: false,
      filter: false,
      width: 200,
      cellStyle: { border: "none" },
      cellRenderer: (params: {
        data: {
          id: number;
          data: ProductDetailAnalytics;
        };
      }) => {
        if (params.data?.data?.productDetail?.provider === "NAVER") {
          return `${params.data?.data?.productDetail?.category?.name} > ${params.data?.data?.productDetail?.category?.subCategory?.name} > ${params.data?.data?.productDetail?.category?.subCategory?.subCategory?.name}`;
        }
        return "-";
      },
    },
    {
      colId: "seoContents",
      headerName: "SEO 콘텐츠수",
      sortable: false,
      filter: false,
      width: 120,
      cellRenderer: (params: {
        data: {
          id: number;
          data: ProductDetailAnalytics;
        };
      }) => {
        const score = getProductAnalyticsChartScore(params.data.data);
        return `${score.seo.pass}개/${score.seo.count}개`;
      },
    },
    {
      colId: "promotionContents",
      headerName: "프로모션 콘텐츠수",
      sortable: false,
      filter: false,
      width: 150,
      cellRenderer: (params: {
        data: {
          id: number;
          data: ProductDetailAnalytics;
        };
      }) => {
        const score = getProductAnalyticsChartScore(params.data.data);
        if (score.promotion) {
          return `${score.promotion?.pass}개/${score.promotion?.count}개`;
        }
        return "-";
      },
    },
    {
      colId: "deliveryContents",
      headerName: "배송 콘텐츠수",
      sortable: false,
      filter: false,
      width: 120,
      cellRenderer: (params: {
        data: {
          id: number;
          data: ProductDetailAnalytics;
        };
      }) => {
        const score = getProductAnalyticsChartScore(params.data.data);
        if (score.delivery) {
          return `${score.delivery?.pass}개/${score.delivery?.count}개`;
        }
        return "-";
      },
    },
    {
      colId: "action",
      headerName: "",
      width: 120,
      pinned: "right",
      cellRenderer: (params: {
        data: {
          id: number;
          data: ProductDetailAnalytics;
        };
      }) => {
        return (
          <Link href={`/product?historyId=${params.data?.id}`}>
            <button className={styles.actionButton}>상세보기</button>
          </Link>
        );
      },
    },
  ];

  return (
    <>
      <div className="max-w-[1440px] w-full flex flex-col">
        <SubNavigation
          items={[
            { label: "마이 페이지", path: "/mypage" },
            { label: "상품 분석 내역", path: "/mypage/product/analytics" },
          ]}
          currentPath="/mypage/product/analytics"
        />

        <div
          className={classNames(
            styles.tableContainer,
            "w-full h-[640px] mt-6 ag-theme-quartz"
          )}
        >
          {!data || data.length === 0 ? (
            <div className={styles.empty}>
              <Animate />
              <span>상품 분석 내역이 없어요.</span>
            </div>
          ) : (
            <AgGridReact
              rowData={data}
              columnDefs={columnDefs as any}
              defaultColDef={{
                resizable: false,
                suppressMovable: false,
                sortable: true,
                filter: false,
              }}
              headerHeight={80}
              rowHeight={56}
              pagination={false}
              suppressPaginationPanel={true}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;

const Animate: React.FC = () => {
  return (
    <div className="w-40 h-40 flex justify-center items-center">
      <Lottie animationData={animationData} loop={true} />
    </div>
  );
};
