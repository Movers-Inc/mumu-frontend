import classNames from "classnames";
import dynamic from "next/dynamic";
import React, { useState } from "react";

import animationData from "./animation.json";

// asset part
import Sort from "./sort.svg";
import Check from "./check.svg";
import Checked from "./checked.svg";

// 동적으로 Lottie 컴포넌트를 로드 (SSR 비활성화)
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

type Action<T> = {
  name: string;
  onClick: (row: T) => void;
};

interface Props<T = object> {
  label?: string;
  data: T[];
  schema: (keyof T | [keyof T, string, string])[];
  uniqueColumn: keyof T | ((item: T) => string);
  actions?: Action<T>[];
  order?: boolean;
  selectedData: T[];
  setSelectedData: React.Dispatch<React.SetStateAction<T[]>>;
  noDataLabel?: string;
}

const Table = <T extends object>(props: Props<T>) => {
  const {
    label,
    data,
    schema,
    uniqueColumn,
    actions,
    selectedData,
    setSelectedData,
    noDataLabel
  } = props;

  const [sortConfig, setSortConfig] = useState<{
    key: keyof T;
    direction: "asc" | "desc";
  } | null>(null);

  const schemaWithLabels: [keyof T, string, string][] = schema.map((column) =>
    typeof column === "string"
      ? [column as keyof T, column as string, ""]
      : (column as [keyof T, string, string])
  );

  const uniqueColumnIdentifier = (item: T) => {
    if (typeof uniqueColumn === "function") {
      return uniqueColumn(item);
    }
    return item[uniqueColumn];
  };

  const toggleSelectedData = (datum: T) => {
    if (isSelected(datum)) {
      setSelectedData((prev: T[]) =>
        prev.filter(
          (item) =>
            uniqueColumnIdentifier(item) !== uniqueColumnIdentifier(datum)
        )
      );
    } else {
      setSelectedData((prev: T[]) => [...prev, datum]);
    }
  };

  const isSelected = (datum: T): boolean => {
    return selectedData.some(
      (item) => uniqueColumnIdentifier(item) === uniqueColumnIdentifier(datum)
    );
  };

  // 모든 데이터를 선택하는 함수
  const selectAll = () => {
    setSelectedData(data);
  };

  // 모든 데이터를 선택 해제하는 함수
  const deselectAll = () => {
    setSelectedData([]);
  };

  // 선택된 데이터가 모두 선택된 상태인지 확인하는 함수
  const isAllSelected = () => {
    return selectedData.length === data.length;
  };

  // 정렬 함수
  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const valueA = a[sortConfig.key];
      const valueB = b[sortConfig.key];

      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortConfig.direction === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      return 0;
    });
  }, [data, sortConfig]);

  // 정렬 설정을 업데이트하는 함수
  const handleSort = (key: keyof T) => {
    setSortConfig((prev) => {
      if (prev && prev.key === key) {
        // 동일한 열을 두 번 클릭하면 방향을 반대로
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      // 새로운 열을 클릭하면 오름차순으로 설정
      return { key, direction: "asc" };
    });
  };

  return (
    <div className={classNames("inline-block w-full min-w-full align-middle")}>
      <div className="overflow-auto scrollbar-hide">
        <table className="min-w-full table-auto scrollbar-hide">
          <thead className="bg-white">
            {label && (
              <tr>
                <div
                  className={classNames(
                    "px-5 text-sm font-pretendard-semibold text-[#7D7D7D] whitespace-nowrap"
                  )}
                >
                  {label}
                </div>
              </tr>
            )}
            <tr className="relative">
              <th scope="col" className="p-5 sticky left-0 bg-white z-10">
                <div
                  className="flex items-center justify-center"
                  onClick={() =>
                    isAllSelected() ? deselectAll() : selectAll()
                  }
                >
                  {isAllSelected() ? (
                    <Checked className="bg-[#3129a5] rounded-[4px]" />
                  ) : (
                    <Check />
                  )}
                </div>
              </th>

              {schemaWithLabels.map(([column, label, type]) => (
                <React.Fragment key={column as string}>
                  <th
                    scope="col"
                    className={classNames(
                      "p-5 text-[16px] text-[#9C9C9C] text-center"
                    )}
                  >
                    <div
                      className={classNames(
                        "whitespace-nowrap",
                        "flex flex-row items-center justify-center gap-1 "
                      )}
                    >
                      {label}
                      {type === "sort" && (
                        <button onClick={() => handleSort(column)}>
                          <Sort />
                        </button>
                      )}
                    </div>
                  </th>
                </React.Fragment>
              ))}

              {!!actions?.length && (
                <th
                  className={classNames(
                    "sticky top-0 right-0 whitespace-nowrap text-right text-sm"
                  )}
                >
                  <div className="pr-4 pl-8"></div>
                </th>
              )}
            </tr>
          </thead>

          <tbody className="bg-white">
            {data?.length === 0 || !data ? (
              <tr>
                <td
                  colSpan={10}
                  className="bg-[#FBFBFC] text-center h-[500px] text-[#E2E2E2] text-[20px] font-semibold"
                >
                  <div className="flex flex-col items-center py-[50px] gap-4 ">
                    <Animate />
                    <span>{noDataLabel ?? ""}</span>
                  </div>
                </td>
              </tr>
            ) : (
              sortedData.map((datum, index) => (
                <tr
                  key={
                    typeof uniqueColumn === "function"
                      ? uniqueColumn(datum) || index
                      : (datum[uniqueColumn] as string | number) || index
                  }
                  className={classNames(
                    "relative",
                    index % 2 === 0 ? "bg-[#FBFBFC] rounded-[8px]" : ""
                  )}
                >
                  <td
                    scope="col"
                    className={classNames("w-8 sticky left-0 z-10")}
                  >
                    <div
                      className="flex items-center justify-center"
                      onClick={() => toggleSelectedData(datum)}
                    >
                      {isSelected(datum) ? (
                        <Checked className="bg-[#3129a5] rounded-[4px]" />
                      ) : (
                        <Check />
                      )}
                    </div>
                  </td>

                  {schemaWithLabels.map(([column]) => (
                    <React.Fragment key={column as string}>
                      <td
                        key={column as string | number}
                        className={classNames(
                          "text-center whitespace-nowrap py-[18px] px-5 text-[16px]",
                          column === "name" ? "z-10" : ""
                        )}
                      >
                        {`${datum[column]}`}
                      </td>
                    </React.Fragment>
                  ))}

                  {!!actions?.length && (
                    <td
                      className={classNames(
                        "sticky top-0 right-0 whitespace-nowrap text-right text-sm font-pretendard-medium",
                        "group z-10"
                      )}
                    >
                      <div
                        className={classNames(
                          "transition opacity-100 pl-8 pr-4 flex justify-end items-center gap-2"
                        )}
                      >
                        {actions?.map((action, actionIdx) => (
                          <a
                            key={action.name}
                            onClick={(e) => {
                              e.stopPropagation();
                              action.onClick(datum);
                            }}
                            className={classNames(
                              actions.length !== 1 && actionIdx === 0
                                ? "bg-[#3129a5] text-white"
                                : "bg-[#F0F0F0] text-black",
                              "rounded-[8px] font-pretendard-medium text-[15px] py-3 px-4",
                              "hover:cursor-pointer hover:bg-[#3129ae] hover:text-white"
                            )}
                          >
                            {action.name}

                            <span className="sr-only">
                              {`${
                                typeof uniqueColumn === "function"
                                  ? uniqueColumn(datum)
                                  : (datum[uniqueColumn] as string | number)
                              }`}
                            </span>
                          </a>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;

const Animate: React.FC = () => {
  return (
    <div className="w-40 h-40 flex justify-center items-center">
      <Lottie animationData={animationData} loop={true} />
    </div>
  );
};
