import { FC, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
// import { ko } from "date-fns/esm/locale";

// // component
// import { FormTime } from "@/components/atoms";

interface DatePickerProps {
  className?: string;
  open: boolean;
  date: Date;
  onClose: () => void;
  onChange: (date: Date) => void;
}

const EventDatePicker: FC<DatePickerProps> = (props) => {
  const { className, open, date, onChange, onClose } = props;

  const [selectedDate, setSelectedDate] = useState<Date | null>(date);

  // 달력을 표시하거나 숨기는 함수
  const handleSubmit: React.MouseEventHandler<HTMLDivElement> = () => {
    if (selectedDate) {
      onChange(selectedDate); // 새로운 날짜 배열로 상위 컴포넌트의 상태를 업데이트
      onClose(); // 달력을 닫음
    }
  };

  const handleDateChange = (selectedDate: Date | null) => {
    setSelectedDate(selectedDate);
  };

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
              "fixed left-0 top-0 z-action-sheet h-screen w-screen bg-black bg-opacity-50",
              "flex flex-col justify-center items-center",
              className
            )}
          >
            <DatePicker
              dateFormat="yyyy-MM-dd"
              withPortal // 선택적으로 포털을 사용하여 레이어가 다른 요소에 의해 가려지지 않도록 함
              selected={selectedDate} // 현재 날짜를 기본 선택값으로 설정
              onChange={(date) => handleDateChange(date)} // 날짜 선택 시 달력을 닫음
              inline // DatePicker를 인라인으로 표시
              minDate={new Date("2025-03-12")}
              maxDate={new Date("2025-03-17")}
              className=""
            />

            <div className="w-full flex flex-row justify-center items-center gap-2 mt-4"></div>

            <div
              className="mt-5 text-center bg-black text-white py-2 px-3 rounded-[12px]"
              onClick={handleSubmit}
            >
              설정
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {open && <></>}
    </>
  );
};

export default EventDatePicker;
