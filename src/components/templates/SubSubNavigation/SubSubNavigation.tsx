"use client";
import React from "react";
import { useRouter } from "next/navigation";
import classNames from "classnames";

interface SubSubNavigationProps {
  items: { label: string; detail: string; path: string }[]; // 메뉴 아이템 {라벨, 경로} 리스트
  currentPath: string; // 현재 경로
}

const SubSubNavigation: React.FC<SubSubNavigationProps> = ({
  items,
  currentPath
}) => {
  const router = useRouter();

  return (
    <nav className="flex flex-row w-fit gap-4 mb-5">
      {items.map((item) => (
        <button
          key={item.path}
          onClick={() => router.push(item.path)}
          className={classNames(
            "flex flex-col rounded-[8px] p-3 justify-start",
            currentPath === item.path
              ? "bg-[#e7ebff] text-[#3129a5]"
              : "bg-[#FBFBFC] text-[#9C9C9C]"
          )}
        >
          <div className="text-[20px] font-semibold">{item.label}</div>

          <div className="text-[14px] font-regular">{item.detail}</div>
        </button>
      ))}
    </nav>
  );
};

export default SubSubNavigation;
