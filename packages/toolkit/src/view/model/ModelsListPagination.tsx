import { useMemo } from "react";
import { Pagination } from "@instill-ai/design-system";
import { env } from "../../server";
import { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import { ListUserModelsResponse } from "../../lib";

const defaultPaginationProps = {
  isPrevDisabled: true,
  isNextDisabled: true,
  currentPage: 0,
  totalPages: 0,
};

export type ModelsListPaginationProps = {
  models: UseInfiniteQueryResult<InfiniteData<ListUserModelsResponse>>;
  setPageNumber: React.Dispatch<React.SetStateAction<number>>;
  pageNumber: number;
};

export const ModelsListPagination = ({
  models,
  pageNumber,
  setPageNumber,
}: ModelsListPaginationProps) => {
  const paginationProps = useMemo(() => {
    if (!models.data || models.data.pages.length === 0) {
      return defaultPaginationProps;
    }

    const pageSize = env("NEXT_PUBLIC_QUERY_PAGE_SIZE") || 10;
    const totalPages = Math.ceil(models.data.pages[0].total_size / pageSize);

    let isNextDisabled = true;

    if (models.hasNextPage || pageNumber < totalPages - 1) {
      isNextDisabled = false;
    }

    return {
      isPrevDisabled: pageNumber === 0,
      isNextDisabled,
      currentPage: pageNumber + 1,
      totalPages,
    };
  }, [models, pageNumber]);

  if (!models.data || paginationProps.totalPages <= 1) {
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
                  !models.data.pages[newCurrentNumber]
                ) {
                  models.fetchNextPage();
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
