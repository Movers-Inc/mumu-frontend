"use client";
import React, { useEffect, useCallback, useState } from "react";
import { NextPage } from "next";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";

import { AdminAPI, AuthAPI } from "@/api";

import { TextInputGray } from "@/components/atoms";
import { useRole } from "@/providers";

import { CreateAdminDto } from "@/dtos/admin/CreateAdmin.dto";
import { SubNavigation } from "@/components/templates";

interface mypageInput {
  name: string;
  hireDate: string;
  birthDate: string;
  position: string;
  phone: string;
  address: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

const HomePage: NextPage = () => {
  const [myId, setMyId] = useState<number>(-1);
  const [createAdmin, setCreateAdmin] = useState<CreateAdminDto>();
  const { role } = useRole();

  // react-hook-form 선언
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<mypageInput>({
    mode: "onChange"
  });

  // 사용자 프로필 가져오기
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await AuthAPI.getProfile(); // API 호출
        setMyId(profile.id);
        if (profile) {
          // 폼에 기본값 설정
          setValue("name", profile.name || "");
          setValue("hireDate", profile.joinAt || "");
          setValue("birthDate", profile.birth || "");
          setValue("position", profile.position || "");
          setValue("phone", profile.phone || "");
          setValue("address", profile.address || "");
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

  const handleValidSubmit: SubmitHandler<mypageInput> = useCallback(
    async (data) => {
      try {
        if (role === "MASTER") {
          const adminData: CreateAdminDto = {
            userId: data.email,
            password: data.password,
            name: data.name,
            position: "-",
            role: "MASTER",
            phone: data.phone,
            birth: data.birthDate,
            joinAt: "-",
            address: "-"
          };
          setCreateAdmin(adminData);
        } else {
          const adminData: CreateAdminDto = {
            userId: data.email,
            password: data.password,
            name: data.name,
            position: data.position,
            role: "GENERAL",
            phone: data.phone,
            birth: data.birthDate,
            joinAt: data.hireDate,
            address: data.address
          };
          setCreateAdmin(adminData);
        }

        if (myId !== -1) {
          console.log(createAdmin);
          await AdminAPI.updateAdmin(myId, createAdmin as CreateAdminDto);
          console.log("succed");
        } else {
          console.log("fucked");
        }
      } catch (error) {
        console.log(error);
      }
    },
    [myId]
  );

  const handleInvalidSubmit: SubmitErrorHandler<mypageInput> = useCallback(
    (errors) => {
      const errorMessage = Object.values(errors).map(
        ({ message }) => message
      )?.[0];
      console.log(errorMessage);
    },
    []
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
          <div className="w-full pb-2 mb-4 text-[16px] font-bold border-b-[0.4px] border-[#9C9C9C]">
            내 계정 정보
          </div>

          <div className="flex flex-wrap gap-8 py-2">
            {role == "GENERAL" ? (
              <>
                <TextInputGray
                  label="이름"
                  type="text"
                  value={watch("name")}
                  {...register("name", { required: "이름을 입력해주세요" })}
                  className="flex-grow basis-1/4"
                  error={errors.name?.message}
                />
                <TextInputGray
                  label="입사일"
                  type="text"
                  value={watch("hireDate")}
                  {...register("hireDate")}
                  className="flex-grow basis-1/4"
                  error={errors.hireDate?.message}
                />
                <TextInputGray
                  label="생년월일"
                  type="text"
                  value={watch("birthDate")}
                  {...register("birthDate")}
                  className="flex-grow basis-1/4"
                  error={errors.birthDate?.message}
                />
                <TextInputGray
                  label="직급"
                  type="text"
                  value={watch("position")}
                  {...register("position")}
                  className="flex-grow basis-1/4"
                  error={errors.position?.message}
                />
                <TextInputGray
                  label="연락처"
                  type="text"
                  value={watch("phone")}
                  {...register("phone", { required: "연락처를 입력해주세요" })}
                  className="flex-grow basis-1/4"
                  error={errors.phone?.message}
                />
                <TextInputGray
                  label="주소"
                  type="text"
                  value={watch("address")}
                  {...register("address")}
                  className="flex-grow basis-1/4"
                  error={errors.address?.message}
                />
                <TextInputGray
                  label="이메일(아이디)"
                  type="text"
                  autoComplete="off"
                  value={watch("email")}
                  {...register("email", { required: "이메일을 입력해주세요" })}
                  className="flex-grow basis-1/4"
                  error={errors.email?.message}
                />
                <TextInputGray
                  label="패스워드"
                  type="password"
                  autoComplete="new-password"
                  {...register("password", {
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
                  className="flex-grow basis-1/4"
                  error={errors.passwordConfirm?.message}
                />
              </>
            ) : (
              <>
                <TextInputGray
                  label="이름"
                  type="text"
                  value={watch("name")}
                  {...register("name", { required: "이름을 입력해주세요" })}
                  className="flex-grow basis-1/4"
                  error={errors.name?.message}
                />
                <TextInputGray
                  label="생년월일"
                  type="text"
                  value={watch("birthDate")}
                  {...register("birthDate")}
                  className="flex-grow basis-1/4"
                  error={errors.birthDate?.message}
                />
                <TextInputGray
                  label="연락처"
                  type="text"
                  value={watch("phone")}
                  {...register("phone", { required: "연락처를 입력해주세요" })}
                  className="flex-grow basis-1/4"
                  error={errors.phone?.message}
                />
                <TextInputGray
                  label="이메일(아이디)"
                  type="text"
                  autoComplete="off"
                  value={watch("email")}
                  {...register("email", { required: "이메일을 입력해주세요" })}
                  className="flex-grow basis-1/4"
                  error={errors.email?.message}
                />
                <TextInputGray
                  label="패스워드"
                  type="password"
                  autoComplete="new-password"
                  {...register("password", {
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
                  className="flex-grow basis-1/4"
                  error={errors.passwordConfirm?.message}
                />
              </>
            )}
          </div>
          <button
            onClick={handleSubmit(handleValidSubmit, handleInvalidSubmit)}
            className="w-[150px] h-[40px] mt-10 bg-[#222222] rounded-[8px] text-white hover:bg-[#FF5E3A]"
          >
            저장
          </button>
        </div>
      </div>
    </>
  );
};

export default HomePage;
