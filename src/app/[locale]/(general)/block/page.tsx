"use client";

import React from "react";
import { NextPage } from "next";
import { useRouter } from "next/navigation";

// component part

import { Common } from "@/components/popups";


const HomePage: NextPage = () => {
  const router = useRouter();

  const handleNext = () => {

    router.back();

  };

  return (
    <div className="h-screen flex flex-col px-8 pb-8">
      <Common
        open={true}
        onClose={undefined}
        placeholder={"닫기"}
        body={
          "이 기능에 접근할 수 있는 권한이 없습니다. /n권한이 있는 계정으로 다시 로그인해주세요."
        }
        title={"접근 권한이 없습니다"}
        onNext={handleNext}
      />
    </div>
  );
};

export default HomePage;
