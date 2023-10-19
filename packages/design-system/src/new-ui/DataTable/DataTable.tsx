"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table } from "../Table";
import * as React from "react";
import { DataTablePagination } from "./DataTablePagination";
import { Input } from "../Input";
import { Nullable } from "../../types/general";
import { Skeleton } from "../Skeleton";
import { Icons } from "../Icons";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSize: number;
  searchPlaceholder: Nullable<string>;
  searchKey: Nullable<string>;
  isLoading: boolean;
  loadingRows: Nullable<number>;
  children?: React.ReactNode;
  primaryText: Nullable<string>;
  secondaryText: Nullable<string>;
}

const DataTable = <TData, TValue>({
  columns,
  data,
  pageSize,
  searchPlaceholder,
  searchKey,
  isLoading,
  loadingRows,
  children,
  primaryText,
  secondaryText,
}: DataTableProps<TData, TValue>) => {
  const [rowSelection, setRowSelection] = React.useState({});
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: {
        pageSize: pageSize,
      },
    },
    state: {
      rowSelection,
      sorting,
      columnFilters,
    },
  });

  return (
    <div>
      <div className="flex flex-row rounded-t-sm border border-b-0 bg-semantic-bg-primary px-6 py-5">
        <div className="w-3/4">
          <div className="flex flex-col space-y-2">
            <h4 className="w-full text-semantic-fg-primary product-body-text-1-semibold">
              {primaryText}
            </h4>
            <p className="w-full text-semantic-fg-disabled product-body-text-3-regular">
              {secondaryText}
            </p>
          </div>
        </div>
        <div className="flex w-1/4 items-end">
          {searchKey && (
            <Input.Root className="w-full">
              <Input.LeftIcon>
                <Icons.SearchSm className="my-auto h-5 w-5 stroke-semantic-fg-secondary" />
              </Input.LeftIcon>
              <Input.Core
                disabled={false}
                type="text"
                placeholder={searchPlaceholder || ""}
                value={
                  (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn(searchKey)?.setFilterValue(event.target.value)
                }
              />
              {(table.getColumn(searchKey)?.getFilterValue() as string) && (
                <Input.LeftIcon
                  onClick={() => {
                    table.getColumn(searchKey)?.setFilterValue("");
                  }}
                >
                  <Icons.X className="my-auto h-5 w-5 cursor-pointer stroke-semantic-fg-secondary" />
                </Input.LeftIcon>
              )}
            </Input.Root>
          )}
        </div>
      </div>
      <Table.Root>
        <Table.Header>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Row key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <Table.Head key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </Table.Head>
                );
              })}
            </Table.Row>
          ))}
        </Table.Header>
        <Table.Body>
          {isLoading ? (
            <>
              {[...Array(loadingRows || 6).keys()].map((e) => (
                <Table.Row
                  key={`table-skeleton-row-${e}`}
                  className="bg-semantic-bg-primary"
                >
                  {[...Array(columns.length).keys()].map((e) => (
                    <Table.Cell key={`table-skeleton-cell-${e}`}>
                      <Skeleton className="h-5" />
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))}
            </>
          ) : (
            <>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <Table.Row
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="bg-semantic-bg-primary"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <Table.Cell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Table.Cell>
                    ))}
                  </Table.Row>
                ))
              ) : (
                <Table.Row
                  className="bg-semantic-bg-primary"
                  key="table-empty-placeholder-row"
                >
                  <Table.Cell
                    colSpan={columns.length}
                    className="h-24 !p-0 text-center"
                  >
                    {children}
                  </Table.Cell>
                </Table.Row>
              )}
            </>
          )}
        </Table.Body>
      </Table.Root>

      <DataTablePagination table={table} />
    </div>
  );
};

export { DataTable };
