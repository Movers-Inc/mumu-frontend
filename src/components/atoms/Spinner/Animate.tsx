// Tooltip.js
import React from "react";
import dynamic from "next/dynamic";
import animationData from "./animation.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface AnimateProps {
  className?: string;
}

const Animate: React.FC<AnimateProps> = () => {
  return (
    <div className="w-40 h-40 flex justify-center items-center">
      <Lottie animationData={animationData} loop={true} />
    </div>
  );
};

export default Animate;
