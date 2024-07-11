import { useMemo } from "react";
import { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";

import { Pagination } from "@instill-ai/design-system";

import { ListPipelinesResponse } from "../../../lib";
import { env } from "../../../server";

const defaultPaginationProps = {
  isPrevDisabled: true,
  isNextDisabled: true,
  currentPage: 0,
  totalPages: 0,
};

export type PipelinesListPaginationProps = {
  pipelines: UseInfiniteQueryResult<InfiniteData<ListPipelinesResponse>>;
  setPageNumber: React.Dispatch<React.SetStateAction<number>>;
  pageNumber: number;
};

export const PipelinesListPagination = ({
  pipelines,
  pageNumber,
  setPageNumber,
}: PipelinesListPaginationProps) => {
  const paginationProps = useMemo(() => {
    if (!pipelines.data || pipelines.data.pages.length === 0) {
      return defaultPaginationProps;
    }

    const pageSize = env("NEXT_PUBLIC_QUERY_PAGE_SIZE") || 10;
    const totalPages = Math.ceil(pipelines.data.pages[0].totalSize / pageSize);

    let isNextDisabled = true;

    if (pipelines.hasNextPage || pageNumber < totalPages - 1) {
      isNextDisabled = false;
    }

    return {
      isPrevDisabled: pageNumber === 0,
      isNextDisabled,
      currentPage: pageNumber + 1,
      totalPages,
    };
  }, [pipelines.isSuccess, pipelines.data, pageNumber]);

  if (!pipelines.data || paginationProps.totalPages <= 1) {
    return null;
  }

  return (
    <Pagination.Root>
      <Pagination.Content>
        <Pagination.Item>
          <Pagination.Prev
            disabled={paginationProps.isPrevDisabled}
            onClick={() => setPageNumber((currentNumber) => currentNumber - 1)}
          />
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.PageIndicator
            currentPage={paginationProps.currentPage}
            totalPages={paginationProps.totalPages}
          />
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Next
            disabled={paginationProps.isNextDisabled}
            onClick={() => {
              setPageNumber((currentNumber) => {
                const newCurrentNumber = currentNumber + 1;

                if (
                  paginationProps.currentPage < paginationProps.totalPages &&
                  !pipelines.data.pages[newCurrentNumber]
                ) {
                  pipelines.fetchNextPage();
                }

                return newCurrentNumber;
              });
            }}
          />
        </Pagination.Item>
      </Pagination.Content>
    </Pagination.Root>
  );
};
