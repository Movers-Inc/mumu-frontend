import classNames from "classnames";

import React, { FC } from "react";

interface BackgroundProps {
  className?: string;
}

const Background: FC<BackgroundProps> = (props) => {
  const { className } = props;

  return (
    <div
      className={classNames(
        "h-full w-full bg-cover bg-center relative",
        className
      )}
      style={{ backgroundImage: "url('/login/bg.png')" }}
    >
      <div className="font-semibold text-[#222] text-[48px] w-full flex-wrap font-pretendard-semibold leading-[150%] tracking-tighter absolute top-[20%] px-10 z-50">
        지금 바로{" "}
        <span className="font-gilroy-heavyitalic text-[#3129a5] leading-[150%] tracking-tighter">
          무무마케팅
        </span>
        을 도입하고 <br />
        광고 효율을 최적화해보세요
      </div>

      <div className="w-[66%] h-[76%] absolute bottom-0 right-10 rotate-5">
        <img src="/login/chart.png" className="w-full h-full" alt="chart" />
      </div>
    </div>
  );
};

export default Background;
