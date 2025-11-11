"use client";
import React from "react";
import { useRouter } from "next/navigation";
import classNames from "classnames";

interface SubNavigationProps {
  items: { label: string; path: string }[]; // 메뉴 아이템 {라벨, 경로} 리스트
  currentPath: string; // 현재 경로
}

const SubNavigation: React.FC<SubNavigationProps> = ({
  items,
  currentPath
}) => {
  const router = useRouter();

  return (
    <nav className="flex flex-row w-fit gap-4 mt-10 mb-8">
      {items.map((item) => (
        <button
          key={item.label}
          onClick={() => !(currentPath === item.path) && router.push(item.path)}
          className={classNames(
            "font-bold text-[24px]",
            currentPath === item.path
              ? "text-[#222222]  border-b-[3px] border-[#3129a5]"
              : "text-[#9C9C9C]"
          )}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
};

export default SubNavigation;
