import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import React, { FC, useCallback, useEffect, useState } from "react";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";

import { AdminAPI } from "@/api";

import { TextInputGray } from "@/components/atoms";
import { Common } from "@/components/popups";

import { AdminListDto } from "@/dtos/admin/AdminList.dto";
import { CreateAdminDto } from "@/dtos/admin/CreateAdmin.dto";
import { formatTel } from "@/utils";

interface SignInInput {
  hireDate: string;
  birthDate: string;
  name: string;
  position: string;
  phone: string;
  address: string;
  email: string;
  password: string;
}

interface AERegisterProps {
  admin?: AdminListDto;
  open?: boolean;
  mode: "register" | "update";
  onClose?: () => void;
  refetch: () => void;
}

const AERegisterPopup: FC<AERegisterProps> = (props) => {
  const { admin, open, mode, onClose, refetch } = props;

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { isValid, errors }
  } = useForm<SignInInput>({
    mode: "onChange"
  });

  const [popupOpen, setPopupOpen] = useState(false); // 팝업 상태

  const watchAllFields = watch(); // 모든 필드의 값을 확인

  // 모든 필드가 입력되어 있는지 확인
  const areAllFieldsFilled = Object.values(watchAllFields).every(
    (value) => value !== undefined && value !== null && value !== ""
  );

  // 버튼 활성화 조건
  const isFormValid = isValid && areAllFieldsFilled;

  const setFormValues = useCallback(
    (admin: AdminListDto) => {
      setValue("hireDate", admin.joinAt || "");
      setValue("birthDate", admin.birth || "");
      setValue("name", admin.name || "");
      setValue("position", admin.position || "");
      setValue("phone", admin.phone || "");
      setValue("address", admin.address || "");
      setValue("email", admin.userId || "");
      setValue("password", "");
    },
    [setValue]
  );

  const resetFormValues = useCallback(() => {
    setValue("hireDate", "");
    setValue("birthDate", "");
    setValue("name", "");
    setValue("position", "");
    setValue("phone", "");
    setValue("address", "");
    setValue("email", "");
    setValue("password", "");
  }, [setValue]);

  useEffect(() => {
    if (open) {
      if (mode === "update" && admin) {
        setFormValues(admin);
      } else if (mode === "register") {
        resetFormValues();
      }
    }
  }, [admin, open, mode]);

  const phoneValue = watch("phone"); // 전화번호 값 감시

  useEffect(() => {
    if (phoneValue) {
      const formattedPhone = formatTel(phoneValue);
      if (formattedPhone !== phoneValue) {
        setValue("phone", formattedPhone, { shouldValidate: true });
      }
    }
  }, [phoneValue, setValue]);

  const handleValidSubmit: SubmitHandler<SignInInput> = useCallback(
    async (data) => {
      try {
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

        if (mode === "register") {
          await AdminAPI.createAdmin(adminData);
        } else if (admin) {
          await AdminAPI.updateAdmin(admin?.id, adminData);
        }

        onClose?.();
        refetch();
      } catch (error) {
        console.log(error);
        setPopupOpen(true);
      }
    },
    [mode, admin, refetch]
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

  return (
    <>
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
                <div className="font-bold text-[24px] mb-6">
                  {mode === "register"
                    ? "매니저 계정 등록"
                    : "매니저 계정 수정"}
                </div>

                <div className="flex flex-col gap-5">
                  <div className="flex flex-row gap-5">
                    <TextInputGray
                      label="입사일"
                      placeholder="YY.MM.DD"
                      type="text"
                      autoComplete="off"
                      value={watch("hireDate")}
                      {...register("hireDate", {
                        required: "입사일을 입력해주세요",
                        pattern: {
                          value:
                            /^\d{2}\.(0[1-9]|1[0-2])\.(0[1-9]|[12][0-9]|3[01])$/,
                          message: "YY.MM.DD 형식으로 입력해주세요."
                        }
                      })}
                      error={errors.hireDate?.message}
                    />

                    <TextInputGray
                      label="생년월일"
                      placeholder="YY.MM.DD"
                      type="text"
                      autoComplete="off"
                      value={watch("birthDate")}
                      {...register("birthDate", {
                        required: "생년월일을 입력해주세요",
                        pattern: {
                          value:
                            /^\d{2}\.(0[1-9]|1[0-2])\.(0[1-9]|[12][0-9]|3[01])$/,
                          message: "YY.MM.DD 형식으로 입력해주세요."
                        }
                      })}
                      error={errors.birthDate?.message}
                    />
                  </div>

                  <div className="flex flex-row gap-5">
                    <TextInputGray
                      label="이름"
                      placeholder="홍길동"
                      type="text"
                      autoComplete="off"
                      value={watch("name")}
                      {...register("name", {
                        required: "이름을 입력해주세요"
                      })}
                      error={errors.name?.message}
                    />

                    <TextInputGray
                      label="직급"
                      placeholder="사원"
                      type="text"
                      autoComplete="off"
                      value={watch("position")}
                      {...register("position", {
                        required: "직급을 입력해주세요"
                      })}
                      error={errors.position?.message}
                    />
                  </div>

                  <TextInputGray
                    label="전화번호"
                    placeholder="010-0000-0000"
                    type="text"
                    autoComplete="off"
                    value={watch("phone")}
                    {...register("phone", {
                      required: "전화번호를 입력해주세요",
                      pattern: {
                        value: /^\d{3}-\d{3,4}-\d{4}$/,
                        message: "11자리를 입력해야해요."
                      }
                    })}
                    error={errors.phone?.message}
                  />

                  <TextInputGray
                    label="주소"
                    placeholder="서울시 중구 청계천로 100"
                    type="text"
                    autoComplete="off"
                    value={watch("address")}
                    {...register("address", {
                      required: "주소를 입력해주세요"
                    })}
                    error={errors.address?.message}
                  />

                  <TextInputGray
                    label="이메일"
                    placeholder="dddmkt123@dddmkt.com"
                    type="email"
                    autoComplete="off"
                    value={watch("email")}
                    {...register("email", {
                      required: "이메일을 입력해주세요",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "올바른 이메일 형식으로 입력해주세요."
                      }
                    })}
                    error={errors.email?.message}
                  />

                  <TextInputGray
                    label="비밀번호"
                    placeholder="영문, 숫자, 특수문자 조합 8자리 이상"
                    type="password"
                    autoComplete="new-password"
                    value={watch("password")}
                    {...register("password", {
                      required: "비밀번호를 입력해주세요",
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
        open={popupOpen}
        title="계정을 생성할 수 없습니다."
        body="동일한 연락처나 이메일을 가진 계정이 이미 있습니다./n다른 항목을 입력해주세요."
        prevplacehloder="닫기"
        onClose={() => setPopupOpen(false)}
      />
    </>
  );
};

export default AERegisterPopup;
