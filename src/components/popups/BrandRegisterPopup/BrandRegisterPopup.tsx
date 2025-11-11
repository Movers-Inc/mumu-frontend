import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import React, { FC, useCallback, useEffect, useState } from "react";
import {
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
  FormProvider
} from "react-hook-form";

import { BrandAPI } from "@/api";

import { TextInputGray, BusinessNumInput } from "@/components/atoms";

import { BrandDto } from "@/dtos/brand/Brand.dto";
import { CreateBrandDto } from "@/dtos/brand/CreateBrand.dto";
import Common from "../Common";
import { formatTel } from "@/utils";

interface SignInInput {
  mainName: string;
  subName: string;
  businessType: string;
  businessNum: string;
  yearlySale: string;
  employeeCnt: string;
  ceoName: string;
  phone: string;
  userId: string;
  password: string;
}

interface BrandRegisterProps {
  brand?: BrandDto;
  open?: boolean;
  mode: "register" | "update";
  onClose?: () => void;
  refetch: () => void;
}

const BrandRegisterPopup: FC<BrandRegisterProps> = (props) => {
  const { brand, open, mode, onClose, refetch } = props;

  const [businessNumVerified, setBusinessNumVerified] =
    useState<boolean>(false);
  const [businessStatus, setBusinessStatus] = useState<string>("");
  const [verifiedOpen, setVerifiedOpen] = useState<boolean>(false);
  const [isBusinessNumVerified, setIsBusinessNumVerified] = useState(false);
  const methods = useForm<SignInInput>({
    mode: "onChange"
  });

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { isValid, errors }
  } = methods;

  const [popupOpen, setPopupOpen] = useState(false); // 팝업 상태

  const watchAllFields = watch(); // 모든 필드 값 확인

  // 모든 필드가 채워졌는지 확인하는 함수
  const areAllFieldsFilled = Object.values(watchAllFields).every(
    (value) => value !== undefined && value !== null && value !== ""
  );

  const isFormValid = isValid && areAllFieldsFilled && isBusinessNumVerified;

  const handleBusinessNumVerification = (verified: boolean) => {
    setIsBusinessNumVerified(verified);
  };

  const setFormValues = useCallback(
    (brand: BrandDto) => {
      setValue("mainName", brand.mainName || "");
      setValue("subName", brand.subName || "");
      setValue("businessType", brand.businessType || "");
      setValue("businessNum", brand.businessNum || "");
      setValue("yearlySale", brand.yearlySale.toLocaleString() || "");
      setValue("employeeCnt", brand.employeeCnt.toString() || "");
      setValue("ceoName", brand.ceoName || "");
      setValue("phone", brand.phone || "");
      setValue("userId", brand.userId || "");
      setValue("password", "");
    },
    [setValue]
  );

  const resetFormValues = useCallback(() => {
    setValue("mainName", "");
    setValue("subName", "");
    setValue("businessType", "");
    setValue("businessNum", "");
    setValue("yearlySale", "");
    setValue("employeeCnt", "");
    setValue("ceoName", "");
    setValue("phone", "");
    setValue("userId", "");
    setValue("password", "");
  }, [setValue]);

  const resetBusinessNumState = useCallback(() => {
    setBusinessNumVerified(false);
    setBusinessStatus("");
    setVerifiedOpen(false);
  }, []);

  useEffect(() => {
    if (open) {
      if (mode === "update" && brand) {
        setFormValues(brand);
      } else if (mode === "register") {
        resetFormValues();
      }
    } else {
      resetBusinessNumState();
    }
  }, [brand, open, mode, resetBusinessNumState]);

  const handleValidSubmit: SubmitHandler<SignInInput> = useCallback(
    async (data) => {
      try {
        const brandData: CreateBrandDto = {
          mainName: data.mainName,
          subName: data.subName,
          businessNum: data.businessNum,
          businessType: data.businessType,
          yearlySale: data.yearlySale
            ? parseFloat(data.yearlySale.replace(/,/g, "")) // 쉼표 제거 후 숫자로 변환
            : 0, // 변환 실패 시 기본값
          employeeCnt: data.employeeCnt
            ? parseInt(data.employeeCnt.replace(/,/g, ""), 10) // 쉼표 제거 후 정수로 변환
            : 0, // 변환 실패 시 기본값
          ceoName: data.ceoName,
          userId: data.userId,
          phone: data.phone,
          password: data.password
        };

        if (mode === "register") {
          console.log(brandData);
          await BrandAPI.createBrand(brandData);
        } else if (brand) {
          await BrandAPI.updateBrand(brand?.id, brandData);
        }

        onClose?.();
        refetch();
      } catch (error) {
        console.log(error);
        setPopupOpen(true);
      }
    },
    [mode, brand, refetch]
  );

  const handleInvalidSubmit: SubmitErrorHandler<SignInInput> = useCallback(
    (errors) => {
      const errorMessage = Object.values(errors).map(
        ({ message }) => message
      )?.[0];
      console.log(errorMessage);
    },
    []
  );

  const yearlySaleValue = watch("yearlySale");

  useEffect(() => {
    if (yearlySaleValue) {
      // 숫자가 아닌 문자 제거
      const numericString = yearlySaleValue.replace(/[^0-9]/g, "");
      // 3자리마다 콤마 추가
      const formattedYearlySale = numericString.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ","
      );
      if (formattedYearlySale !== yearlySaleValue) {
        setValue("yearlySale", formattedYearlySale, { shouldValidate: true });
      }
    }
  }, [yearlySaleValue, setValue]);

  const employeeCntValue = watch("employeeCnt");

  useEffect(() => {
    if (employeeCntValue) {
      // 숫자가 아닌 문자 제거
      const numericString = employeeCntValue.replace(/[^0-9]/g, "");
      // 3자리마다 콤마 추가
      const formattedEmployeeCnt = numericString.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ","
      );
      if (formattedEmployeeCnt !== employeeCntValue) {
        setValue("employeeCnt", formattedEmployeeCnt, { shouldValidate: true });
      }
    }
  }, [employeeCntValue, setValue]);

  const phoneValue = watch("phone");

  useEffect(() => {
    if (phoneValue) {
      const formattedPhone = formatTel(phoneValue);
      if (formattedPhone !== phoneValue) {
        setValue("phone", formattedPhone, { shouldValidate: true });
      }
    }
  }, [phoneValue, setValue]);

  return (
    <FormProvider {...methods}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                onClose?.();
              }
            }}
            className={classNames(
              "fixed left-0 top-0 z-action-sheet h-screen w-screen bg-black bg-opacity-50 p-6 md:p-0",
              "flex flex-row justify-start items-center"
            )}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.3, bounce: false }}
              className="mx-auto flex w-full max-w-[500px] flex-col items-center justify-center bg-white rounded-[12px]"
            >
              <div className="flex flex-col w-full bg-white rounded-[8px] p-10 text-[#222222] ">
                <div className="font-semibold text-[24px] mb-6">
                  {mode === "register"
                    ? "신규 브랜드 등록"
                    : "신규 브랜드 수정"}
                </div>

                <div className="flex flex-col gap-5">
                  {/* 브랜드 정보 */}
                  <div className="font-semibold pb-1 text-[16px] text-[#222222] border-b-[0.4px] border-[#9C9C9C]">
                    브랜드 정보
                  </div>
                  <div className="flex flex-row gap-3">
                    <TextInputGray
                      label="브랜드 이름(Main)"
                      placeholder=""
                      type="text"
                      autoComplete="off"
                      {...register("mainName")}
                      value={watch("mainName")}
                      error={errors.mainName?.message}
                    />

                    <TextInputGray
                      label="브랜드 이름 (Sub)"
                      placeholder=""
                      type="text"
                      autoComplete="off"
                      {...register("subName")}
                      value={watch("subName")}
                      error={errors.subName?.message}
                    />
                  </div>

                  <TextInputGray
                    label="브랜드 업종"
                    placeholder=""
                    type="text"
                    autoComplete="off"
                    {...register("businessType")}
                    value={watch("businessType")}
                    error={errors.businessType?.message}
                  />

                  <BusinessNumInput
                    name="businessNum"
                    onVerifyChange={handleBusinessNumVerification} // 검증 상태 변경 콜백 전달
                  />

                  <div className="flex flex-row gap-3">
                    <TextInputGray
                      label="연 매출액(원)"
                      placeholder=""
                      type="text"
                      autoComplete="off"
                      {...register("yearlySale")}
                      value={watch("yearlySale")}
                      error={errors.yearlySale?.message}
                    />

                    <TextInputGray
                      label="전월 마케팅비 현황(원)"
                      placeholder=""
                      type="text"
                      autoComplete="off"
                      {...register("employeeCnt")}
                      value={watch("employeeCnt")}
                      error={errors.employeeCnt?.message}
                    />
                  </div>

                  {/* 대표자 정보 */}
                  <div className="font-semibold pt-3 pb-1 text-[16px] text-[#222222] border-b-[0.4px] border-[#9C9C9C]">
                    대표자 정보
                  </div>

                  <div className="flex flex-row gap-3">
                    <TextInputGray
                      label="대표자명"
                      placeholder=""
                      type="text"
                      autoComplete="off"
                      {...register("ceoName")}
                      value={watch("ceoName")}
                      error={errors.ceoName?.message}
                    />

                    <TextInputGray
                      label="대표자 연락처"
                      placeholder=""
                      type="text"
                      autoComplete="off"
                      {...register("phone", {
                        pattern: {
                          value: /^\d{3}-\d{3,4}-\d{4}$/,
                          message: "000-0000-000의 형식으로 입력해주세요"
                        }
                      })}
                      value={watch("phone")}
                      error={errors.phone?.message}
                    />
                  </div>

                  <TextInputGray
                    label="대표 관리자 이메일(아이디)"
                    placeholder=""
                    type="text"
                    autoComplete="off"
                    {...register("userId", {
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                        message: "올바른 이메일 형식이 아닙니다"
                      }
                    })}
                    value={watch("userId")}
                    error={errors.userId?.message}
                  />

                  <TextInputGray
                    label="대표 관리자 패스워드"
                    placeholder=""
                    type="password"
                    autoComplete="new-password"
                    value={watch("password")}
                    {...register("password", {
                      pattern: {
                        value:
                          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                        message:
                          "패스워드는 영문, 숫자, 특수문자 조합 8자리 이상이어야 해요"
                      }
                    })}
                    error={errors.password?.message}
                  />
                </div>

                <div className="flex flex-row justify-between gap-4 mt-11">
                  <button
                    onClick={onClose}
                    className="bg-[#E2E2E2] rounded-[8px] text-[#222222] px-12 py-3 font-pretendard-medium w-full whitespace-nowrap hover:bg-[#E1DDDD]"
                  >
                    취소
                  </button>

                  <button
                    onClick={handleSubmit(
                      handleValidSubmit,
                      handleInvalidSubmit
                    )}
                    className={classNames(
                      "bg-[#222222] rounded-[8px] text-white px-12 py-3 font-pretendard-medium w-full hover:bg-[#FF5E3A]",
                      isFormValid ? "" : "opacity-20 pointer-events-none"
                    )}
                  >
                    {mode === "update" ? "수정" : "등록"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Common
        open={verifiedOpen}
        prevplacehloder="닫기"
        onClose={() => setVerifiedOpen(false)}
        body={
          businessNumVerified
            ? "정상적인 사업자 번호입니다./n등록 및 수정을 이어서 진행해주십시오."
            : `사업자등록번호에 문제가 있습니다. 다시 확인해주세요./n(실패사유 : ${businessStatus})`
        }
        title={businessNumVerified ? "검증 완료!" : "검증실패"}
      />
      <Common
        open={popupOpen}
        title="계정을 생성할 수 없습니다."
        body="동일한 연락처나 이메일을 가진 계정이 이미 있습니다./n다른 항목을 입력해주세요."
        prevplacehloder="닫기"
        onClose={() => setPopupOpen(false)}
      />
    </FormProvider>
  );
};

export default BrandRegisterPopup;
