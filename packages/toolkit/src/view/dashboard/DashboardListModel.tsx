"use client";

import * as React from "react";
import Link from "next/link";
import {
    ColumnDef,
    DataTable,
    PaginationState,
} from "@instill-ai/design-system";
import { mockTableData } from "./helpers";
// import { InstillStore, useInstillStore, useRouteInfo, useShallow } from "../../lib";
import { TABLE_PAGE_SIZE } from "../pipeline/view-pipeline/constants";
import { RunsTableSortableColHeader, RunStateLabel } from "../../components";
import { getHumanReadableStringFromTime } from "../../server";

// const selector = (store: InstillStore) => ({
//     accessToken: store.accessToken,
//     enabledQuery: store.enabledQuery,
// });

type TableData = typeof mockTableData[0];

export const DashboardListModel = () => {
    const [orderBy, setOrderBy] = React.useState<string>();
    const [paginationState, setPaginationState] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: TABLE_PAGE_SIZE,
    });
    // const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));
    // const routeInfo = useRouteInfo();

    const pageCount = React.useMemo(() => {
        return Math.ceil(mockTableData.length / TABLE_PAGE_SIZE);
    }, []);

    const onSortOrderUpdate = (sortValue: string) => {
        setPaginationState((currentValue) => ({
            ...currentValue,
            pageIndex: 0,
        }));
        setOrderBy(sortValue);
    };

    const tableColumns = React.useMemo(() => {
        const baseColumns: ColumnDef<TableData>[] = [
            {
                accessorKey: "pipelineId",
                header: () => <div className="text-left">Model ID</div>,
                cell: ({ row }) => {
                    return (
                        <div className="font-normal text-semantic-bg-secondary-secondary break-all">
                            <Link
                                href={`/models/${row.getValue("pipelineId")}`}
                                className="text-semantic-accent-default hover:underline"
                            >
                                {row.getValue("pipelineId")}
                            </Link>
                        </div>
                    );
                },
            },
            {
                accessorKey: "runId",
                header: () => <div className="text-left">Run ID</div>,
                cell: ({ row }) => {
                    return (
                        <div className="font-normal text-semantic-bg-secondary-secondary break-all">
                            <Link
                                href={`/models/${row.getValue("pipelineId")}/runs/${row.getValue("runId")}`}
                                className="text-semantic-accent-default hover:underline"
                            >
                                {row.getValue("runId")}
                            </Link>
                        </div>
                    );
                },
            },
            {
                accessorKey: "version",
                header: () => <div className="text-left">Version</div>,
                cell: ({ row }) => {
                    return (
                        <div className="font-normal text-semantic-bg-secondary-secondary break-all">
                            {row.getValue("version")}
                        </div>
                    );
                },
            },
            {
                accessorKey: "status",
                header: () => <div className="text-left">Status</div>,
                cell: ({ row }) => {
                    return (
                        <RunStateLabel
                            state={row.getValue("status")}
                            className="inline-flex"
                        />
                    );
                },
            },
            {
                accessorKey: "source",
                header: () => <div className="text-left">Source</div>,
                cell: ({ row }) => {
                    return (
                        <div className="font-normal text-semantic-bg-secondary-secondary break-all">
                            {row.getValue("source")}
                        </div>
                    );
                },
            },
            {
                accessorKey: "totalDuration",
                header: () => (
                    <RunsTableSortableColHeader
                        title="Total Duration"
                        paramName="total_duration"
                        currentSortParamValue={orderBy}
                        onSort={onSortOrderUpdate}
                    />
                ),
                cell: ({ row }) => {
                    return (
                        <div className="font-normal text-semantic-bg-secondary-alt-primary">
                            {row.getValue("totalDuration")}
                        </div>
                    );
                },
            },
            {
                accessorKey: "triggerTime",
                header: () => (
                    <RunsTableSortableColHeader
                        title="Trigger Time"
                        paramName="trigger_time"
                        currentSortParamValue={orderBy}
                        onSort={onSortOrderUpdate}
                    />
                ),
                cell: ({ row }) => {
                    return (
                        <div className="font-normal text-semantic-bg-secondary-alt-primary">
                            {getHumanReadableStringFromTime(
                                row.getValue("triggerTime"),
                                Date.now()
                            )}
                        </div>
                    );
                },
            },
            {
                accessorKey: "runner",
                header: () => <div className="text-left">Runner</div>,
                cell: ({ row }) => {
                    return (
                        <div className="font-normal text-semantic-bg-secondary-secondary break-all">
                            <Link
                                target="_blank"
                                className="text-semantic-accent-default hover:underline"
                                href={`/${row.getValue("runner")}`}
                            >
                                {row.getValue("runner")}
                            </Link>
                        </div>
                    );
                },
            },
            {
                accessorKey: "credit",
                header: () => <div className="text-left">Credit</div>,
                cell: ({ row }) => {
                    return (
                        <div className="font-normal text-semantic-bg-secondary-secondary break-all">
                            {row.getValue("credit")}
                        </div>
                    );
                },
            },
            {
                accessorKey: "creditOwner",
                header: () => <div className="text-left">Credit Owner</div>,
                cell: ({ row }) => {
                    return (
                        <div className="font-normal text-semantic-bg-secondary-secondary break-all">
                            {row.getValue("creditOwner")}
                        </div>
                    );
                },
            },
        ];

        return baseColumns;
    }, [orderBy]);

    if (mockTableData.length === 0) {
        return (
            <div className="relative flex flex-col items-center">
                <img
                    width={513}
                    height={481}
                    src="/images/models/no-models-placeholder.svg"
                    alt="A box and a looking glass"
                />
                <p className="absolute left-1/2 top-3/4 flex -translate-x-1/2 flex-col items-center gap-y-2 text-center text-xl font-semibold text-semantic-fg-primary">
                    <span className="whitespace-nowrap">No model runs found</span>
                    <span className="text-base font-normal text-semantic-fg-secondary">
                        Once you run a model, it will appear here
                    </span>
                </p>
            </div>
        );
    }

    return (
        <div className="[&_table]:table-fixed [&_table_td]:align-top [&_table_th]:w-40 [&_table_th:nth-child(1)]:w-auto [&_table_th:nth-child(7)]:w-52 [&_table_th:nth-child(8)]:w-28">
            <DataTable
                columns={tableColumns}
                data={mockTableData}
                pageSize={paginationState.pageSize}
                isLoading={false}
                loadingRows={paginationState.pageSize}
                pageCount={pageCount}
                manualPagination={true}
                showPageNumbers
                onPaginationStateChange={setPaginationState}
                paginationState={paginationState}
            />
        </div>
    );
};