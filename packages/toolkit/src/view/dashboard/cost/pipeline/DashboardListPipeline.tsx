"use client";

import * as React from "react";
import Link from "next/link";
import {
    ColumnDef,
    DataTable,
    PaginationState,
} from "@instill-ai/design-system";
import {
    InstillStore,
    useInstillStore,
    useShallow,
    useListPipelineRunsByRequester
} from "../../../../lib";
import { TABLE_PAGE_SIZE } from "../../../pipeline/view-pipeline/constants";
import { RunsTableSortableColHeader, RunStateLabel } from "../../../../components";
import { getHumanReadableStringFromTime } from "../../../../server";
import { PipelineRun } from "instill-sdk";

const selector = (store: InstillStore) => ({
    accessToken: store.accessToken,
    enabledQuery: store.enabledQuery,
});

export const DashboardListPipeline = () => {
    const [orderBy, setOrderBy] = React.useState<string>();
    const [paginationState, setPaginationState] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: TABLE_PAGE_SIZE,
    });

    const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

    const pipelineRuns = useListPipelineRunsByRequester({
        enabled: enabledQuery,
        accessToken,
        pageSize: paginationState.pageSize,
        pageToken: paginationState.pageIndex.toString(),
        filter: orderBy,
    });

    const onSortOrderUpdate = (sortValue: string) => {
        setPaginationState((currentValue) => ({
            ...currentValue,
            pageIndex: 0,
        }));
        setOrderBy(sortValue);
    };

    const tableColumns = React.useMemo(() => {
        const baseColumns: ColumnDef<PipelineRun>[] = [
            {
                accessorKey: "pipelineId",
                header: () => <div className="text-left">Pipeline ID</div>,
                cell: ({ row }) => {
                    return (
                        <div className="font-normal text-semantic-bg-secondary-secondary break-all">
                            <Link
                                href={`/pipelines/${row.getValue("pipelineId")}`}
                                className="text-semantic-accent-default hover:underline"
                            >
                                {row.getValue("pipelineId")}
                            </Link>
                        </div>
                    );
                },
            },
            {
                accessorKey: "id",
                header: () => <div className="text-left">Run ID</div>,
                cell: ({ row }) => {
                    return (
                        <div className="font-normal text-semantic-bg-secondary-secondary break-all">
                            <Link
                                href={`/pipelines/${row.getValue("pipelineId")}/runs/${row.getValue("id")}`}
                                className="text-semantic-accent-default hover:underline"
                            >
                                {row.getValue("id")}
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

    if (pipelineRuns.isSuccess && !pipelineRuns.data.pipelineRuns.length) {
        return (
            <div className="relative flex flex-col items-center">
                <img
                    width={513}
                    height={481}
                    src="/images/pipelines/no-pipelines-placeholder.svg"
                    alt="A box and a looking glass"
                />
                <p className="absolute left-1/2 top-3/4 flex -translate-x-1/2 flex-col items-center gap-y-2 text-center text-xl font-semibold text-semantic-fg-primary">
                    <span className="whitespace-nowrap">No pipeline runs found</span>
                    <span className="text-base font-normal text-semantic-fg-secondary">
                        Once you run a pipeline, it will appear here
                    </span>
                </p>
            </div>
        );
    }

    return (
        <div className="[&_table]:table-fixed [&_table_td]:align-top [&_table_th]:w-40 [&_table_th:nth-child(1)]:w-auto [&_table_th:nth-child(7)]:w-52 [&_table_th:nth-child(8)]:w-28">
            <DataTable
                columns={tableColumns}
                data={pipelineRuns.data?.pipelineRuns || []}
                pageSize={paginationState.pageSize}
                isLoading={pipelineRuns.isLoading}
                loadingRows={paginationState.pageSize}
                pageCount={Math.ceil((pipelineRuns.data?.totalSize || 0) / TABLE_PAGE_SIZE)}
                manualPagination={true}
                showPageNumbers
                onPaginationStateChange={setPaginationState}
                paginationState={paginationState}
            />
        </div>
    );
};