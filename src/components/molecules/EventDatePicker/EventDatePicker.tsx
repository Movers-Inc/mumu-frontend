import { FC, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import { format, isSameDay, isToday } from "date-fns";

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

  const dayClassName = useMemo(
    () => (day: Date) =>
      classNames(
        "mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors duration-150",
        selectedDate && isSameDay(day, selectedDate)
          ? "bg-gray-900 text-white shadow-md"
          : isToday(day)
          ? "border border-gray-900 text-gray-900"
          : "text-gray-600 hover:bg-gray-100"
      ),
    [selectedDate]
  );

  // 달력을 표시하거나 숨기는 함수
  const handleSubmit = () => {
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
              "fixed left-0 top-0 z-action-sheet flex h-screen w-screen items-center justify-center bg-black/60 backdrop-blur-sm",
              className
            )}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(event) => event.stopPropagation()}
              className="w-[min(90vw,384px)] rounded-3xl bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.25)]"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.18em] text-gray-400">
                    Schedule
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    날짜를 선택하세요
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-gray-900 hover:text-gray-900"
                >
                  <span className="sr-only">닫기</span>
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.343 3.343L10.657 10.657"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M10.657 3.343L3.343 10.657"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex justify-center">
                <DatePicker
                  dateFormat="yyyy-MM-dd"
                  withPortal
                  selected={selectedDate}
                  onChange={(date) => handleDateChange(date)}
                  inline
                  minDate={new Date("2025-11-11")}
                  maxDate={new Date()}
                  calendarClassName="!border-0 !shadow-none"
                  dayClassName={dayClassName}
                  weekDayClassName={() =>
                    "px-2 text-xs font-medium uppercase tracking-[0.08em] text-gray-400"
                  }
                  renderCustomHeader={({
                    date: currentDate,
                    decreaseMonth,
                    increaseMonth,
                    prevMonthButtonDisabled,
                    nextMonthButtonDisabled
                  }) => (
                    <div className="mb-2 flex items-center justify-between px-2">
                      <button
                        type="button"
                        onClick={decreaseMonth}
                        disabled={prevMonthButtonDisabled}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:border-gray-900 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <span className="sr-only">이전 달</span>
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12.5 5L7.5 10L12.5 15"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <div className="text-base font-semibold text-gray-900">
                        {format(currentDate, "yyyy년 M월")}
                      </div>
                      <button
                        type="button"
                        onClick={increaseMonth}
                        disabled={nextMonthButtonDisabled}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:border-gray-900 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <span className="sr-only">다음 달</span>
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7.5 5L12.5 10L7.5 15"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                />
              </div>

              <div className="mt-6 flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                <div>
                  <p className="text-xs text-gray-500">선택된 날짜</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedDate
                      ? format(selectedDate, "yyyy년 M월 d일 (EEE)")
                      : "날짜를 선택해주세요"}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={!selectedDate}
                  onClick={handleSubmit}
                  className="rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  설정완료
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {open && <></>}
    </>
  );
};

export default EventDatePicker;
