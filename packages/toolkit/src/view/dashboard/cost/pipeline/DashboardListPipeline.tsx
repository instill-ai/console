"use client";

import * as React from "react";
import Link from "next/link";
import { PipelineRun } from "instill-sdk";

import {
  ColumnDef,
  DataTable,
  PaginationState,
} from "@instill-ai/design-system";

import {
  RunsTableSortableColHeader,
  RunStateLabel,
} from "../../../../components";
import {
  InstillStore,
  useInstillStore,
  useListPipelineRunsByRequester,
  useShallow,
  useUserNamespaces,
} from "../../../../lib";
import { getHumanReadableStringFromTime } from "../../../../server";
import { TABLE_PAGE_SIZE } from "../../../pipeline/view-pipeline/constants";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  navigationNamespaceAnchor: store.navigationNamespaceAnchor,
});

type DashboardListPipelineProps = {
  start: string;
};

export const DashboardListPipeline = ({
  start,
}: DashboardListPipelineProps) => {
  const { accessToken, enabledQuery, navigationNamespaceAnchor } =
    useInstillStore(useShallow(selector));

  const userNamespaces = useUserNamespaces();
  const targetNamespace = React.useMemo(() => {
    if (!userNamespaces.isSuccess || !navigationNamespaceAnchor) {
      return null;
    }

    return userNamespaces.data.find(
      (namespace) => namespace.id === navigationNamespaceAnchor,
    );
  }, [
    userNamespaces.isSuccess,
    userNamespaces.data,
    navigationNamespaceAnchor,
  ]);

  const [orderBy, setOrderBy] = React.useState<string>();
  const [paginationState, setPaginationState] = React.useState<PaginationState>(
    {
      pageIndex: 0,
      pageSize: TABLE_PAGE_SIZE,
    },
  );

  const pipelineRuns = useListPipelineRunsByRequester({
    enabled: enabledQuery,
    accessToken,
    pageSize: paginationState.pageSize,
    page: paginationState.pageIndex,
    orderBy: orderBy,
    requesterId: targetNamespace?.id,
    requesterUid: targetNamespace?.uid,
    start,
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
                href={`${targetNamespace?.id}/pipelines/${row.getValue("pipelineId")}`}
                className="text-semantic-accent-default hover:underline"
              >
                {row.getValue("pipelineId")}
              </Link>
            </div>
          );
        },
      },
      {
        accessorKey: "pipelineRunUid",
        header: () => <div className="text-left">Run ID</div>,
        cell: ({ row }) => {
          return (
            <div className="font-normal text-semantic-bg-secondary-secondary break-all">
              <Link
                href={`${targetNamespace?.id}/pipelines/${row.getValue("pipelineId")}/runs/${row.getValue("pipelineRunUid")}`}
                className="text-semantic-accent-default hover:underline"
              >
                {row.getValue("pipelineRunUid")}
              </Link>
            </div>
          );
        },
      },
      {
        accessorKey: "pipelineVersion",
        header: () => <div className="text-left">Version</div>,
        cell: ({ row }) => {
          return (
            <div className="font-normal text-semantic-bg-secondary-secondary break-all">
              {row.getValue("pipelineVersion")}
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
        accessorKey: "startTime",
        header: () => (
          <RunsTableSortableColHeader
            title="Trigger Time"
            paramName="start_time"
            currentSortParamValue={orderBy}
            onSort={onSortOrderUpdate}
          />
        ),
        cell: ({ row }) => {
          return (
            <div className="font-normal text-semantic-bg-secondary-alt-primary">
              {getHumanReadableStringFromTime(
                row.getValue("startTime"),
                Date.now(),
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
                href={`${targetNamespace?.id}/pipelines/${row.getValue("runner")}`}
              >
                {row.getValue("runner")}
              </Link>
            </div>
          );
        },
      },
      {
        accessorKey: "creditAmount",
        header: () => <div className="text-left">Credit</div>,
        cell: ({ row }) => {
          return (
            <div className="font-normal text-semantic-bg-secondary-secondary break-all">
              {row.getValue("creditAmount")}
            </div>
          );
        },
      },
      {
        accessorKey: "runnerId",
        header: () => <div className="text-left">Credit Owner</div>,
        cell: ({ row }) => {
          return (
            <div className="font-normal text-semantic-bg-secondary-secondary break-all">
              {row.getValue("runnerId")}
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
          src="/images/models/no-models-placeholder.svg"
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
        pageCount={Math.ceil(
          (pipelineRuns.data?.totalSize || 0) / TABLE_PAGE_SIZE,
        )}
        manualPagination={true}
        showPageNumbers
        onPaginationStateChange={setPaginationState}
        paginationState={paginationState}
      />
    </div>
  );
};
