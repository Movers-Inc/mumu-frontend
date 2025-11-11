"use client";

import classNames from "classnames";
import dynamic from "next/dynamic";
import animationData from "./animation.json";
import React, { FC } from "react";

interface DisplayProps {
  className?: string;
}

// 동적으로 Lottie 컴포넌트를 로드 (SSR 비활성화)
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const Display: FC<DisplayProps> = (props) => {
  const { className } = props;

  return (
    <div className={classNames("h-screen w-screen", className)}>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <Animate />
        <div className="text-[#9C9C9C] text-[20px] font-semibold text-center">
          이 웹사이트는 가로 1024px 이상의 <br /> 데스크톱 브라우저에 최적화되었습니다.
        </div>
      </div>
    </div>
  );
};

export default Display;

const Animate: React.FC = () => {
  return (
    <div className="w-40 h-40 flex justify-center items-center">
      <Lottie animationData={animationData} loop={true} />
    </div>
  );
};