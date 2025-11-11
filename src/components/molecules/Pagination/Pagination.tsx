"use client";

import classNames from "classnames";
import Link from "next/link";
import { FC, useCallback } from "react";
import { createPageGroup } from "./utils";
import { usePathname, useSearchParams } from "next/navigation";

interface Props {
  className?: string;
  currentPage: number;
  totalPages: number;
  onClick?: (page: number) => void;
}

const Pagination: FC<Props> = (props) => {
  const { className, currentPage, totalPages, onClick } = props;
  const pathname = usePathname();

  const searchParams = useSearchParams();

  const updatePageQuery = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", newPage.toString());
      return `${pathname}?${params.toString()}`;
    },
    [searchParams, pathname]
  );

  const canGoBack = currentPage > 1;
  const canGoForward = currentPage < totalPages;

  const pageGroup = createPageGroup(currentPage, totalPages);

  // console.log(pageGroup.map((group, index) => group));
  return (
    <nav
      className={classNames(
        "flex items-center justify-between border-t border-gray-200",
        className
      )}
    >
      <div className="-mt-px flex w-0 flex-1">
        {canGoBack &&
          (onClick ? (
            <div
              onClick={() => onClick(currentPage - 1)}
              className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            >
              Prev
            </div>
          ) : (
            <Link
              href={updatePageQuery(currentPage - 1)}
              className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            >
              Prev
            </Link>
          ))}
      </div>
      <div className="hidden md:-mt-px md:flex">
        {pageGroup.map((group, index) => [
          index > 0 && (
            <span
              key={`etc ${index}`}
              className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500"
            >
              ...
            </span>
          ),
          group.map((page) =>
            onClick ? (
              <div
                key={`group-${index}-${page}`}
                onClick={() => onClick(page)}
                className={classNames(
                  "inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium",
                  page === currentPage
                    ? "text-black border-black-500 hover:border-black-500 hover:text-black-600"
                    : "text-gray-500 hover:border-gray-300 hover:text-gray-700"
                )}
              >
                {page}
              </div>
            ) : (
              <Link
                key={`group-${index}-${page}`}
                href={updatePageQuery(page)}
                className={classNames(
                  "inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium",
                  page === currentPage
                    ? "text-black border-black-500 hover:border-black-500 hover:text-black-600"
                    : "text-gray-500 hover:border-gray-300 hover:text-gray-700"
                )}
              >
                {page}
              </Link>
            )
          )
        ])}

        {/* <span className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500">
          ...
        </span> */}
      </div>
      <div className="-mt-px flex w-0 flex-1 justify-end">
        {canGoForward &&
          (onClick ? (
            <div
              onClick={() => onClick(currentPage + 1)}
              className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            >
              Next
              {/* <ArrowLongRightIcon
            className="ml-3 h-5 w-5 text-gray-400"
            aria-hidden="true"
          /> */}
            </div>
          ) : (
            <Link
              href={updatePageQuery(currentPage + 1)}
              className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            >
              Next
              {/* <ArrowLongRightIcon
              className="ml-3 h-5 w-5 text-gray-400"
              aria-hidden="true"
            /> */}
            </Link>
          ))}
      </div>
    </nav>
  );
};

export default Pagination;
