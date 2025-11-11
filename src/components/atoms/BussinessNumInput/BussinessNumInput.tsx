import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { useFormContext } from "react-hook-form";
import { formatBusinessNum, getBusinessMan } from "@/utils";
import { Common } from "@/components/popups";

interface BusinessNumInputProps {
  name: string;
  onVerifyChange: (verified: boolean) => void;
}

const BusinessNumInput: React.FC<BusinessNumInputProps> = ({ name, onVerifyChange }) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const [businessNumVerified, setBusinessNumVerified] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false); // 팝업 상태
  const [popupTitle, setPopupTitle] = useState(""); // 팝업 제목
  const [popupMessage, setPopupMessage] = useState(""); // 팝업 메시지
  const [popupError, setPopupError] = useState("");

  const businessNumValue = watch(name);

  // 사업자등록번호 검증 함수
  const handleVerify = async () => {
    if (!businessNumValue || businessNumValue.length < 10) {
      setPopupTitle("검증 실패");
      setPopupMessage("유효한 사업자등록번호를 입력해주세요.");
      setPopupOpen(true);
      setBusinessNumVerified(false);
      onVerifyChange(false); // 부모 컴포넌트에 검증 실패 알림
      return;
    }

    try {
      const response = await getBusinessMan(businessNumValue);

      if (response.verified) {
        setPopupTitle("검증 완료!");
        setPopupMessage("정상적인 사업자 번호입니다./n등록 및 수정을 이어서 진행해주십시오.");
        setPopupError("");
        setBusinessNumVerified(true);
        onVerifyChange(true); // 부모 컴포넌트에 검증 성공 알림
      } else {
        setPopupTitle("검증 실패");
        setPopupMessage(`사업자 등록번호에 아래의 문제가 있습니다. 다시 확인해주세요.`);
        setPopupError(`실패사유 : ${response.msg}`)
        setBusinessNumVerified(false);
        onVerifyChange(false); // 부모 컴포넌트에 검증 실패 알림
      }
    } catch (error) {
      setPopupTitle("오류");
      setPopupMessage("API 호출 오류가 발생했습니다.");
      setBusinessNumVerified(false);
    } finally {
      setPopupOpen(true); // 팝업 열기
    }
  };

  // 사업자번호 포맷팅
  useEffect(() => {
    if (businessNumValue) {
      const formatted = formatBusinessNum(businessNumValue);
      if (formatted !== businessNumValue) {
        setValue(name, formatted, { shouldValidate: true });
      }
    }
  }, [businessNumValue, setValue, name]);

  

  return (
    <div>
      <div className="font-pretendard-regular mb-[10px] text-sm text-[#747474]">
        사업자등록번호
      </div>
      <div className="flex justify-center relative flex-row h-12">
        <input
          {...register(name, {
            pattern: {
              value: /^\d{3}-\d{2}-\d{5}$/,
              message: "사업자등록번호 형식에 맞지 않습니다.",
            },
          })}
          maxLength={12}
          className={classNames(
            "w-full outline-none transition rounded-[8px] text-[#222222]",
            "text-[14px] px-3 py-[10px] bg-[#F0F0F0]",
            "placeholder:text-[#AFB8C0]",
            "hover:border-primary-300 focus:bg-[#EAEAFF]"
          )}
          placeholder="000-00-00000"
          onInput={() => {
            if (businessNumVerified) {
              setBusinessNumVerified(false);
              onVerifyChange(false);
            }
          }}
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#FF5E3A] w-16 h-8 rounded-lg disabled:opacity-20 text-white font-medium text-sm tracking-tighter"
          disabled={businessNumVerified}
          onClick={handleVerify}
        >
          {!businessNumVerified ? "검증" : "검증완료"}
        </button>
      </div>
      {errors[name]?.message && (
        <div className="px-2 mt-1 text-sm text-red-500">
          {errors[name]?.message as string}
        </div>
      )}

      {/* Common 팝업 */}
      <Common
        open={popupOpen}
        title={popupTitle}
        body={popupMessage}
        error={popupError}
        prevplacehloder="닫기"
        onClose={() => setPopupOpen(false)} // 팝업 닫기
      />
    </div>
  );
};

export default BusinessNumInput;
