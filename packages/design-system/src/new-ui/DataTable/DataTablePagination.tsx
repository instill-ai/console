import { Table } from "@tanstack/react-table";
import { Button } from "../Button";
import { Icons } from "../Icons";
import cn from "clsx";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function createPaginationArray(
  currentPage: number,
  totalPages: number,
  maxVisiblePages = 10
): (number | string)[] {
  const paginationArray: (number | string)[] = [];

  if (totalPages <= maxVisiblePages) {
    // If total pages are less than or equal to maxVisiblePages, show all pages
    for (let i = 0; i < totalPages; i++) {
      paginationArray.push(i);
    }
  } else {
    // Calculate the number of pages to be shown before and after the current page
    const numPagesBefore: number = Math.floor((maxVisiblePages - 3) / 2);
    const numPagesAfter: number = maxVisiblePages - 3 - numPagesBefore;

    // Add the first pages and an ellipsis if needed
    paginationArray.push(0);
    paginationArray.push(1);
    if (currentPage - numPagesBefore > 2) {
      paginationArray.push("...");
    }

    // Calculate the range of visible pages around the current page
    const startPage: number = Math.max(2, currentPage - numPagesBefore);
    const endPage: number = Math.min(
      totalPages - 2,
      currentPage + numPagesAfter
    );

    // Add visible pages to the pagination array
    for (let i = startPage; i <= endPage; i++) {
      paginationArray.push(i);
    }

    // Add an ellipsis if needed
    if (currentPage + numPagesAfter < totalPages - 2) {
      paginationArray.push("...");
    }

    // Add the last page
    paginationArray.push(totalPages - 1);
  }

  return paginationArray;
}

export function DataTablePagination<TData>({
  table,
  showPageNumbers = true,
  isLoading,
}: DataTablePaginationProps<TData> & {
  showPageNumbers?: boolean;
  isLoading?: boolean;
}) {
  if (table.getPageCount() <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-end py-4">
      <Button
        className="gap-x-2 !rounded-r-none rounded-l-sm !border-semantic-bg-line !py-2.5 px-4"
        variant="secondaryGrey"
        size="sm"
        onClick={() => table.previousPage()}
        disabled={isLoading || !table.getCanPreviousPage()}
      >
        <Icons.ArrowNarrowLeft className="h-5 w-5 stroke-semantic-fg-secondary" />
        <span className="product-body-text-3-semibold">Previous</span>
      </Button>
      {showPageNumbers
        ? createPaginationArray(
            (table.options.state.pagination?.pageIndex || 0) + 1,
            table.getPageCount(),
            8
          ).map((e, index) => (
            <Button
              className={cn(
                "!rounded-none border-l-0 !border-semantic-bg-line !py-2.5 px-2.5",
                table.getPageCount() - 1 === e && "border-r-0"
              )}
              variant="secondaryGrey"
              size="sm"
              onClick={() => table.setPageIndex(Number(e))}
              key={`table-page-button-${index}`}
              disabled={
                isLoading ||
                e === table.options.state.pagination?.pageIndex ||
                e === "..."
              }
            >
              <span className="px-2 product-body-text-3-semibold">
                {e === "..." ? e : Number(e) + 1}
              </span>
            </Button>
          ))
        : null}
      <Button
        className={cn(
          "gap-x-2 !rounded-l-none rounded-r-sm !border-semantic-bg-line !py-2.5 px-4",
          !showPageNumbers ? "border-l-0" : null
        )}
        variant="secondaryGrey"
        size="sm"
        onClick={() => table.nextPage()}
        disabled={isLoading || !table.getCanNextPage()}
      >
        <span className="product-body-text-3-semibold">Next</span>
        <Icons.ArrowNarrowRight className="h-5 w-5 stroke-semantic-fg-secondary" />
      </Button>
    </div>
  );
}
