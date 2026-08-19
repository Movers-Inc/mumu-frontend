"use client";
import React, { useState } from "react";
import { NextPage } from "next";
import classNames from "classnames";
import { useSearchParams } from "next/navigation";

import { Table } from "@/components/organisms";
import { BrandRegisterPopup } from "@/components/popups";
import { SubNavigation, SubSubNavigation } from "@/components/templates";

import { BrandAPI } from "@/api";
import { BrandListDto } from "@/dtos/brand/BrandList.dto";
import { Pagination } from "@/components/molecules";

const HomePage: NextPage = () => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const [open, setOpen] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<BrandListDto[]>([]);

  const [brand, setBrand] = useState<BrandListDto>();
  const [mode, setMode] = useState<"register" | "update">("register");

  const { brands, refetch, pagination } = BrandAPI.useListBrand({
    pagination: { page: page }
  });

  const deleteBrandMutation = BrandAPI.useDeleteBrand(); // Initialize the mutation

  // Delete selected admins
  const handleDelete = async () => {
    if (selectedData.length === 0) {
      return;
    }

    try {
      // Perform delete operations
      await Promise.all(
        selectedData.map((brand) => deleteBrandMutation.mutateAsync(brand.id))
      );

      setSelectedData([]); // Clear the selected data
      refetch(); // Refetch the admin list
    } catch (error) {
      console.error("삭제 중 오류 발생:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="w-full max-w-[1440px] h-screen flex flex-col">
      <SubNavigation
        items={[
          { label: "AE 관리", path: "/manage/mumu" },
          { label: "브랜드 관리", path: "/manage/mumu/brand" }
        ]}
        currentPath="/manage/mumu/brand"
      />
      <SubSubNavigation
        items={[
          {
            label: "브랜드 대시보드",
            detail: "등록된 브랜드의 종합 데이터를 보여줍니다.",
            path: "/manage/mumu/brand"
          },
          {
            label: "브랜드 등록/수정",
            detail: "DDD마케팅 광고주의 정보를 등록/수정 합니다.",
            path: "/manage/mumu/brand/manage"
          }
        ]}
        currentPath="/manage/mumu/brand/manage"
      />
      <div className="flex flex-row min-h-[40px] justify-between items-center pt-5">
        <button
          onClick={() => {
            setMode("register");
            setOpen(true);
          }}
          className="bg-[#3129a5] rounded-[8px] text-white px-[20px] py-[8px] hover:bg-[#222222]"
        >
          + 신규 브랜드 등록
        </button>
        <button
          onClick={handleDelete}
          className={classNames(
            "bg-[#FF3636] rounded-[8px] text-white px-[50px] py-[8px] hover:bg-[#FF9595]",
            selectedData.length
              ? ""
              : "pointer-events-none bg-[#FF3636] opacity-20"
          )}
        >
          삭제
        </button>
      </div>
      <div className="grow pt-4 overflow-auto pb-[100px] scrollbar-hide">
        <div className="bg-white overflow-auto h-full scrollbar-hide ">
          <Table<BrandListDto>
            data={brands ?? []}
            uniqueColumn={"id"}
            schema={[
              ["mainName", "브랜드명", "sort"],
              ["businessType", "업종", "sort"],
              ["businessNum", "사업자등록번호", "sort"],
              ["ceoName", "대표자", "sort"],
              ["phone", "연락처", ""],
              ["userId", "이메일(아이디)", ""],
              ["yearlySale", "연매출액", "sort"],
              ["employeeCnt", "전월 마케팅비 현황(원)", "sort"]
            ]}
            actions={[
              {
                name: "수정",
                onClick: (datum: BrandListDto) => {
                  setBrand(datum);
                  setMode("update");
                  setOpen(true);
                }
              }
            ]}
            selectedData={selectedData}
            setSelectedData={setSelectedData}
            noDataLabel="새 브랜드를 등록해주세요."
          />
        </div>

        <Pagination
          currentPage={page}
          totalPages={pagination?.totalPages ?? 0}
        />
      </div>
      <BrandRegisterPopup
        brand={brand}
        open={open}
        mode={mode}
        refetch={refetch}
        onClose={() => setOpen(false)}
      />
    </div>
  );
};

export default HomePage;
