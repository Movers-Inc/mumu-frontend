import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import React, { FC } from "react";

interface CommonProps {
  open?: boolean;
  title: string;
  body: string;
  placeholder?: string;
  prevplacehloder?: string;
  onNext?: () => void;
  onPrevious?: () => void;
  onClose?: () => void;
  red?: boolean;
  error?: string;
}

const Common: FC<CommonProps> = (props) => {
  const {
    open,
    title,
    body,
    placeholder,
    onNext,
    onClose,
    onPrevious,
    prevplacehloder,
    red,
    error,
  } = props;

  //prevplaceholder => close
  //placeholder => next

  return (
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
            "flex flex-row justify-start items-center"
          )}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3, bounce: false }}
            className="mx-auto flex w-full max-w-[500px] flex-col items-center justify-center md:p-0"
          >
            <div className="flex flex-col w-full gap-2 bg-white rounded-[16px] p-8 shadow-basic">
              <div className="text-[24px] font-semibold mb-5">{title}</div>

              <div className="text-[16px] font-regular mb-5">
                {body.split("/n").map((text, index) => (
                  <span key={index} className="block">
                    {text}
                  </span>
                ))}
                {error && <span className="block text-[#FF5E3A]">{error}</span>}
              </div>

              <div className="flex flex-row justify-between items-center mb-2 gap-4">
                {prevplacehloder && (
                  <button
                    className="bg-[#222222] text-white text-center rounded-[8px] px-6 py-2 w-full"
                    onClick={() => (onPrevious ? onPrevious?.() : onClose?.())}
                  >
                    {prevplacehloder}
                  </button>
                )}

                {placeholder && (
                  <button
                    className={classNames(
                      "text-white text-center rounded-[8px] px-6 py-3 w-full",
                      red ? "bg-[#DA4040]" : "bg-[#444]"
                    )}
                    onClick={() => onNext?.()}
                  >
                    {placeholder}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Common;
