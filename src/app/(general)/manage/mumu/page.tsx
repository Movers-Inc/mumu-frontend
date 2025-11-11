"use client";
import React, { useState } from "react";
import { NextPage } from "next";
import classNames from "classnames";

import { Table } from "@/components/organisms";
import { AERegisterPopup } from "@/components/popups";
import { SubNavigation } from "@/components/templates";

import { AdminAPI } from "@/api";

import { AdminListDto } from "@/dtos/admin/AdminList.dto";

const HomePage: NextPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<AdminListDto[]>([]);
  const [admin, setAdmin] = useState<AdminListDto>();
  const [mode, setMode] = useState<"register" | "update">("register");

  const { admins, refetch } = AdminAPI.useListAdmin();
  const deleteAdminMutation = AdminAPI.useDeleteAdmin(); // Initialize the mutation

  // Delete selected admins
  const handleDelete = async () => {
    if (selectedData.length === 0) {
      return;
    }

    try {
      // Perform delete operations
      await Promise.all(
        selectedData.map((admin) => deleteAdminMutation.mutateAsync(admin.id))
      );

      setSelectedData([]); // Clear the selected data
      refetch(); // Refetch the admin list
    } catch (error) {
      console.error("삭제 중 오류 발생:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="max-w-[1440px] w-full h-screen flex flex-col">
      <SubNavigation
        items={[
          { label: "AE 관리", path: "/manage/mumu" },
          { label: "브랜드 관리", path: "/manage/mumu/brand" }
        ]}
        currentPath="/manage/mumu"
      />
      <div className="flex flex-row min-h-[40px] justify-between items-center pt-5">
        <button
          onClick={() => {
            setMode("register");
            setOpen(true);
          }}
          className="bg-[#3129a5] rounded-[8px] text-white px-[20px] py-[8px] hover:bg-[#222222]"
        >
          + 신규 매니저 계정 등록
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
      <div className="grow pt-4 overflow-auto">
        <div className="bg-white overflow-auto h-full">
          <Table<AdminListDto>
            data={admins ?? []}
            uniqueColumn={"id"}
            schema={[
              ["id", "고유번호", "sort"],
              ["joinAt", "입사일", "sort"],
              ["birth", "생년월일", "sort"],
              ["name", "이름", "sort"],
              ["position", "직급", "sort"],
              ["phone", "연락처", ""],
              ["userId", "이메일", ""],
              ["address", "주소", ""]
            ]}
            actions={[
              {
                name: "수정",
                onClick: (datum: AdminListDto) => {
                  setAdmin(datum);
                  setMode("update");
                  setOpen(true);
                }
              }
            ]}
            selectedData={selectedData}
            setSelectedData={setSelectedData}
            noDataLabel="매니저 계정을 등록해주세요."
          />
        </div>
      </div>

      <AERegisterPopup
        admin={admin}
        open={open}
        mode={mode}
        refetch={refetch}
        onClose={() => setOpen(false)}
      />
    </div>
  );
};

export default HomePage;
