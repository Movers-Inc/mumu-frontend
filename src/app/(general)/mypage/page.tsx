"use client";
import React, { useEffect, useCallback, useState } from "react";
import { NextPage } from "next";
import { SubmitHandler, useForm } from "react-hook-form";

import { AdminAPI, AuthAPI, BrandAPI } from "@/api";
import { TextInputGray } from "@/components/atoms";
import { useRole } from "@/providers";

import { UpdateBrandDto } from "@/dtos/brand/UpdateBrand.dto";
import { UpdateAdminDto } from "@/dtos/admin/UpdateAdmin.dto";
import { SubNavigation } from "@/components/templates";

interface mypageInput {
  brandNameMain: string;
  brandNameSub: string;
  businessType: string;
  businessNum: string;
  revenue: string;
  employeeCnt: string;
  name: string;
  position: string;
  phone: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

const HomePage: NextPage = () => {
  const { role } = useRole();
  const [myId, setMyId] = useState<number>(-1);
  const [myBrandId, setMyBrandId] = useState<number>(-1);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<mypageInput>({
    mode: "onChange"
  });

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await AuthAPI.getProfile();
        setMyId(profile.id);
        setMyBrandId(profile.brandId ?? -1);
        if (role === "GENERAL") {
          setValue("name", profile.name || "");
          setValue("position", profile.position || "");
          setValue("phone", profile.phone || "");
          setValue("email", profile.userId || "");
          setValue("password", "");
          setValue("passwordConfirm", "");
        } else if (role === "MASTER") {
          const brand = await BrandAPI.getBrand(profile.brandId ?? -1);
          setValue("brandNameMain", brand.mainName || "");
          setValue("brandNameSub", brand.subName || "");
          setValue("businessType", brand.businessType || "");
          setValue("businessNum", brand.businessNum || "");
          setValue("revenue", brand.yearlySale.toLocaleString() || "");
          setValue("employeeCnt", brand.employeeCnt.toString() || "");
          setValue("name", profile.name || "");
          setValue("phone", profile.phone || "");
          setValue("email", profile.userId || "");
          setValue("password", "");
          setValue("passwordConfirm", "");
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, [setValue]);

  const onSubmit: SubmitHandler<mypageInput> = useCallback(
    async (data) => {
      try {
        console.log("??");
        let adminData: UpdateAdminDto;
        let brandData: UpdateBrandDto;

        if (role === "GENERAL") {
          adminData = {
            userId: data.email,
            password: data.password,
            name: data.businessNum,
            position: "-",
            role: "GENERAL",
            phone: data.phone,
            birth: "-",
            joinAt: "-",
            address: "-"
          };
          await AdminAPI.updateAdmin(myId, adminData);
        } else {
          brandData = {
            mainName: data.brandNameMain,
            subName: data.brandNameSub,
            businessNum: data.businessNum,
            businessType: data.businessType,
            yearlySale: data.revenue
              ? parseFloat(data.revenue.replace(/[^0-9.-]+/g, "")) // LocaleString을 숫자로 변환
              : 0, // 변환 실패 시 기본값
            employeeCnt: data.employeeCnt
              ? parseInt(data.employeeCnt, 10) // 문자열을 정수로 변환
              : 0, // 변환 실패 시 기본값
            ceoName: data.name,
            userId: data.email,
            phone: data.phone,
            password: data.password
          };
          console.log(brandData);
          await BrandAPI.updateBrand(myBrandId, brandData);
        }
      } catch (error) {
        console.error("Failed to save data:", error);
      }
    },
    [role, myId, myBrandId]
  );

  return (
    <>
      <div className="h-screen bg-white hidden lg:flex justify-center font-pretendard-regular">
        <div className="max-w-[1440px] w-full flex flex-col">
          <SubNavigation
            items={[
              { label: "마이페이지", path: "/mypage" },
              { label: "상품 분석 내역", path: "/mypage/product/analytics" }
            ]}
            currentPath="/mypage"
          />

          {role === "MASTER" ? (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
              <div className="w-full pt-10 pb-2 mb-4 text-[16px] font-semibold border-b-[0.4px] border-[#9C9C9C]">
                브랜드 정보
              </div>
              <div className="flex flex-wrap gap-8 py-2">
                <TextInputGray
                  label="브랜드 이름 (Main)"
                  type="text"
                  value={watch("brandNameMain")}
                  {...register("brandNameMain", {
                    required: "필수 입력 항목입니다."
                  })}
                  error={errors.brandNameMain?.message}
                  className="flex-grow basis-1/4"
                />
                <TextInputGray
                  label="브랜드 이름 (Sub)"
                  type="text"
                  value={watch("brandNameSub")}
                  {...register("brandNameSub")}
                  className="flex-grow basis-1/4"
                />
                <TextInputGray
                  label="브랜드 업종"
                  type="text"
                  value={watch("businessType")}
                  {...register("businessType", {
                    required: "필수 입력 항목입니다."
                  })}
                  error={errors.businessType?.message}
                  className="flex-grow basis-1/4"
                />
                <TextInputGray
                  label="사업자등록번호"
                  type="text"
                  value={watch("businessNum")}
                  {...register("businessNum", {
                    required: "필수 입력 항목입니다."
                  })}
                  error={errors.businessNum?.message}
                  className="flex-grow basis-1/4"
                />
                <TextInputGray
                  label="연 매출액(원)"
                  type="text"
                  value={watch("revenue")}
                  {...register("revenue")}
                  className="flex-grow basis-1/4"
                />
                <TextInputGray
                  label="전월 마케팅비 현황"
                  type="text"
                  value={watch("employeeCnt")}
                  {...register("employeeCnt")}
                  className="flex-grow basis-1/4"
                />
              </div>
              <div className="w-full pt-10 pb-2 mb-4 text-[16px] font-bold border-b-[0.4px] border-[#9C9C9C]">
                대표자 정보
              </div>
              <div className="flex flex-wrap gap-8 py-2">
                <TextInputGray
                  label="대표자명"
                  type="text"
                  value={watch("name")}
                  {...register("name", { required: "필수 입력 항목입니다." })}
                  error={errors.name?.message}
                  className="flex-grow basis-1/4"
                />
                <TextInputGray
                  label="대표자 연락처"
                  type="text"
                  value={watch("phone")}
                  {...register("phone", { required: "필수 입력 항목입니다." })}
                  error={errors.phone?.message}
                  className="flex-grow basis-1/4"
                />
                <TextInputGray
                  label="대표 관리자 이메일(아이디)"
                  type="text"
                  value={watch("email")}
                  autoComplete="off"
                  {...register("email", { required: "필수 입력 항목입니다." })}
                  error={errors.email?.message}
                  className="flex-grow basis-1/4"
                />
                <TextInputGray
                  label="대표 관리자 패스워드"
                  type="password"
                  autoComplete="new-password"
                  {...register("password", {
                    required: "필수 입력 항목입니다.",
                    pattern: {
                      value:
                        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                      message:
                        "패스워드는 영문, 숫자, 특수문자 조합 8자리 이상이어야 합니다."
                    }
                  })}
                  error={errors.password?.message}
                  className="flex-grow basis-1/4"
                />
                <TextInputGray
                  label="대표 관리자 패스워드 확인"
                  type="password"
                  autoComplete="new-password"
                  {...register("passwordConfirm", {
                    validate: (value) =>
                      value === watch("password") ||
                      "패스워드가 일치하지 않습니다."
                  })}
                  error={errors.passwordConfirm?.message}
                  className="flex-grow basis-1/4"
                />
                <div className="flex-grow basis-1/4"></div>
              </div>
              <button
                type="submit"
                className="w-[150px] h-[40px] mt-10 bg-[#222222] rounded-[8px] text-white hover:bg-[#FF5E3A]"
              >
                저장
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
              <div className="w-full pt-10 pb-2 mb-4 text-[16px] font-bold border-b-[0.4px] border-[#9C9C9C]">
                내 계정 정보
              </div>
              <div className="flex flex-wrap gap-8 py-2">
                <TextInputGray
                  label="이름"
                  type="text"
                  value={watch("name")}
                  {...register("name", { required: "필수 입력 항목입니다." })}
                  error={errors.name?.message}
                  className="flex-grow basis-1/4"
                />
                <TextInputGray
                  label="직급"
                  type="text"
                  value={watch("position")}
                  {...register("position")}
                  className="flex-grow basis-1/4"
                />
                <TextInputGray
                  label="연락처"
                  type="text"
                  value={watch("phone")}
                  {...register("phone", { required: "필수 입력 항목입니다." })}
                  error={errors.phone?.message}
                  className="flex-grow basis-1/4"
                />
                <TextInputGray
                  label="이메일(아이디)"
                  type="text"
                  autoComplete="off"
                  value={watch("email")}
                  {...register("email", { required: "필수 입력 항목입니다." })}
                  error={errors.email?.message}
                  className="flex-grow basis-1/4"
                />
                <TextInputGray
                  label="패스워드"
                  type="password"
                  autoComplete="new-password"
                  {...register("password", {
                    required: "필수 입력 항목입니다.",
                    pattern: {
                      value:
                        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                      message:
                        "패스워드는 영문, 숫자, 특수문자 조합 8자리 이상이어야 합니다."
                    }
                  })}
                  error={errors.password?.message}
                  className="flex-grow basis-1/4"
                />
                <TextInputGray
                  label="패스워드 확인"
                  type="password"
                  {...register("passwordConfirm", {
                    validate: (value) =>
                      value === watch("password") ||
                      "패스워드가 일치하지 않습니다."
                  })}
                  error={errors.passwordConfirm?.message}
                  className="flex-grow basis-1/4"
                />
              </div>
              <button
                type="submit"
                className="w-[150px] h-[40px] mt-10 bg-[#222222] rounded-[8px] text-white hover:bg-[#FF5E3A]"
              >
                저장
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;
