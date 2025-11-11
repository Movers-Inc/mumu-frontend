import classNames from "classnames";
import React, { FC, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ToastProps {
  className?: string;
  body: string;
  open: boolean;
  onClose: () => void;
}

const useAutoClose = (open: boolean, duration: number, onClose: () => void) => {
  useEffect(() => {
    if (open) {
      const timeout = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timeout);
    }
  }, [open, duration, onClose]);
};

const Toast: FC<ToastProps> = ({ className, body, open, onClose }) => {
  useAutoClose(open, 1500, onClose);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -50 }} // 위에서 시작
          animate={{ opacity: 1, y: 0 }} // 제자리로
          exit={{ opacity: 0, y: -50 }} // 위로 사라짐
          transition={{ duration: 0.5 }} // 애니메이션 지속 시간
          onAnimationComplete={() => {
            if (!open) onClose(); // Ensure onClose is called after animation
          }}
          className={classNames(
            "fixed left-0 top-0 z-action-sheet h-screen w-screen",
            "flex flex-row justify-center items-end",
            className
          )}
        >
          <div className="fixed top-10 rounded-[6px] flex w-max bg-[#F2F2F2] px-5 py-3 text-[#2B3134] shadow-box text-sm font-pretendard-medium">
            {body.split("/n").map((line, index) => (
              <div className="text-[18px] text-black" key={index}>
                {line}
                <br />
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
