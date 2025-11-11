import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import React, { FC, useEffect, useState } from "react";

import Animate from "./Animate";
interface SpinnerProps {
  className?: string;
  text: string;
}

const Spinner: FC<SpinnerProps> = (props) => {
  const { className, text } = props;
  const [dots, setDots] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === "") return ".";
        if (prev === ".") return "..";
        if (prev === "..") return "...";
        return "";
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
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
            <div
              className={classNames(
                "flex flex-col w-full gap-2 bg-white rounded-[16px] py-12 shadow-basic items-center gap-6",
                className
              )}
            >
              <div className="">
                <Animate />
              </div>

              <div className="text-[26px] px-[50px]">
                {text.split("\n").map((line, index) => (
                  <div key={index}>
                    {line}
                    {index === text.split("\n").length - 1 && (
                      <span>{dots}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      }
    </AnimatePresence>
  );
};

export default Spinner;
