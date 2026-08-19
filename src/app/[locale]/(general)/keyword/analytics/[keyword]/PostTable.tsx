import classNames from "classnames";
import React, { useState } from "react";

// asset part
import Sort from "./svg/sort.svg";
import Blog from "./svg/blog.svg";
import Cafe from "./svg/cafe.svg";
import News from "./svg/news.svg";
import Post from "./svg/post.svg";

interface Props<T = object> {
  data: T[];
  schema: (keyof T | [keyof T, string, string])[];
  uniqueColumn: keyof T | ((item: T) => string);
  order?: boolean;
}

const PostTable = <T extends object>(props: Props<T>) => {
  const { data, schema, uniqueColumn } = props;

  const [sortConfig, setSortConfig] = useState<{
    key: keyof T;
    direction: "asc" | "desc";
  } | null>({ key: "title" as keyof T, direction: "asc" });

  // 'type'이 3이 아닌 데이터만 남기기
  const filteredData = React.useMemo(() => {
    return data.filter((item) => item["type" as keyof T] !== 3);
  }, [data]);

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const valueA = a[sortConfig.key];
      const valueB = b[sortConfig.key];

      if (valueA === undefined || valueB === undefined) return 0;

      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortConfig.direction === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      if (typeof valueA === "number" && typeof valueB === "number") {
        return sortConfig.direction === "asc"
          ? valueA - valueB
          : valueB - valueA;
      }

      return 0;
    });
  }, [filteredData, sortConfig]);

  const handleSort = (key: keyof T) => {
    setSortConfig((prev) => {
      if (prev && prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const schemaWithLabels: [keyof T, string, string][] = schema.map((column) =>
    typeof column === "string"
      ? [column as keyof T, column as string, ""]
      : (column as [keyof T, string, string])
  );

  const handleData = (data: string, column: keyof T) => {
    if (column === "title") {
      const withoutTags = data.replace(/<[^>]*>/g, "");
      const parser = new DOMParser();
      const doc = parser.parseFromString(withoutTags, "text/html");
      return doc.documentElement.textContent || "";
    } else if (column === "postDate") {
      return formatDate(data);
    } else if (column === "type") {
      return getImageDiv(parseInt(data));
    } else return data;
  };

  const getImageDiv = (type: number) => {
    if (type === 0) {
      return (
        <div className="flex flex-row gap-2 items-center text-[#222]">
          <Blog /> 블로그
        </div>
      );
    }
    if (type === 1) {
      return (
        <div className="flex flex-row gap-2 items-center text-[#222]">
          <Cafe /> 카페
        </div>
      );
    }
    if (type === 2) {
      return (
        <div className="flex flex-row gap-2 items-center text-[#222]">
          <News /> 뉴스
        </div>
      );
    }
    if (type === 3) {
      return null; // 'type'이 3인 경우 렌더링 안 함
    } else return;
  };

  const formatDate = (dateStr: string): string => {
    if (/^\d{8}$/.test(dateStr)) {
      const year = dateStr.slice(0, 4);
      const month = dateStr.slice(4, 6);
      const day = dateStr.slice(6, 8);
      return `${year}.${month}.${day}`;
    }
    const parsedDate = new Date(dateStr);
    if (!isNaN(parsedDate.getTime())) {
      const year = parsedDate.getFullYear();
      const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
      const day = String(parsedDate.getDate()).padStart(2, "0");
      return `${year}.${month}.${day}`;
    }
    return dateStr;
  };

  return (
    <div className={classNames("inline-block w-full align-middle")}>
      <div className="overflow-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-[#FBFBFC]">
            <tr className="relative">
              {schemaWithLabels.map(([column, label, type]) => (
                <React.Fragment key={column as string}>
                  <th
                    scope="col"
                    className={classNames(
                      "p-5 text-[16px] text-[#9C9C9C] text-center font-normal"
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
            </tr>
          </thead>

          <tbody className="bg-[#FBFBFC]">
            {sortedData.map((datum, index) => (
              <tr
                key={
                  typeof uniqueColumn === "function"
                    ? `${uniqueColumn(datum)}-${index}`
                    : `${datum[uniqueColumn] || "key"}-${index}`
                }
                className={classNames("relative hover:cursor-pointer")}
                onClick={() => {
                  if ("link" in datum && typeof datum.link === "string") {
                    window.open(datum.link, "_blank");
                  }
                }}
              >
                {schemaWithLabels.map(([column], index: number) => (
                  <React.Fragment key={`${index} col ${column as string}`}>
                    <td
                      key={column as string | number}
                      className={classNames(
                        "text-[16px] py-[17.5px]",
                        column === "title" ? "px-[18px] pr-[60px]" : "",
                        column === "source" ? "px-[25px]" : ""
                      )}
                    >
                      <div
                        className={classNames(
                          "w-full line-clamp-1 white-space-nowrap",
                          column === "postDate" ? "text-center" : ""
                        )}
                      >
                        {datum[column] === ""
                          ? "-"
                          : datum[column] != undefined
                          ? handleData(`${datum[column]}`, column)
                          : "-"}
                      </div>
                    </td>
                  </React.Fragment>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PostTable;
