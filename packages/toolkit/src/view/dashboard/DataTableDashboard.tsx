"use client";

import * as React from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    PaginationState,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";

import { StatusTag } from "./StatusTag";
import { Nullable } from "instill-sdk";
import { Skeleton, Table } from "@instill-ai/design-system";
import { DataTableDashboardPagination } from "./DataTablePagination";

type DataTableDashboardProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pageSize: number;
    isLoading: boolean;
    loadingRows: Nullable<number>;
    children?: React.ReactNode;
    manualPagination?: boolean;
    pageCount?: number;
    onPaginationStateChange?: (state: PaginationState) => void;
    paginationState?: PaginationState;
};

const DataTableDashboard = <TData, TValue>({
    columns,
    data,
    pageSize,
    isLoading,
    loadingRows,
    children,
    manualPagination,
    pageCount,
    onPaginationStateChange,
    showPageNumbers,
    paginationState,
}: DataTableDashboardProps<TData, TValue> & { showPageNumbers?: boolean }) => {
    const [rowSelection, setRowSelection] = React.useState({});
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        [],
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
            ...(paginationState ? { pagination: paginationState } : null),
        },
        manualPagination,
        pageCount,
        ...(onPaginationStateChange
            ? {
                onPaginationChange: (updater) => {
                    if (typeof updater !== "function") {
                        return;
                    }

                    const newPageState = updater(table.getState().pagination);

                    onPaginationStateChange(newPageState);
                },
            }
            : null),
    });

    return (
        <div>
            <Table.Root wrapperClassName="rounded-t-sm">
                <Table.Header>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Table.Row key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <Table.Head key={header.id} className="text-center">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                    </Table.Head>
                                );
                            })}
                        </Table.Row>
                    ))}
                </Table.Header>
                <Table.Body>
                    {isLoading ? (
                        <React.Fragment>
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
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <Table.Row
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className="bg-semantic-bg-primary"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <Table.Cell key={cell.id} className="text-center">
                                                {cell.column.id === "pipelineId" ||
                                                    cell.column.id === "version" ||
                                                    cell.column.id === "runner" ? (
                                                    <span className="text-semantic-accent-default">
                                                        {flexRender(
                                                            cell.column.columnDef.cell,
                                                            cell.getContext(),
                                                        )}
                                                    </span>
                                                ) : cell.column.id === "status" ? (
                                                    <StatusTag
                                                        status={
                                                            (() => {
                                                                const rendered = flexRender(
                                                                    cell.column.columnDef.cell,
                                                                    cell.getContext(),
                                                                );
                                                                return typeof rendered === 'string'
                                                                    ? rendered.replace("FILE_PROCESS_STATUS_", "")
                                                                    : String(rendered);
                                                            })()
                                                        }
                                                    />
                                                ) : (
                                                    flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext(),
                                                    )
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
                        </React.Fragment>
                    )}
                </Table.Body>
            </Table.Root>
            {(typeof pageCount !== "undefined" && pageCount > 1) ||
                data.length > pageSize ? (
                <DataTableDashboardPagination
                    table={table}
                    showPageNumbers={showPageNumbers}
                    isLoading={isLoading}
                />
            ) : null}
        </div>
    );
};

export { DataTableDashboard };