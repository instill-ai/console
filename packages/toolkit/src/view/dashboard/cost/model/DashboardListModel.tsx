"use client";

import * as React from "react";
import Link from "next/link";
import { ModelRun } from "instill-sdk";

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
  useListModelRunsByRequester,
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

type DashboardListModelProps = {
  start: string;
};

export const DashboardListModel = ({ start }: DashboardListModelProps) => {
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

  const modelRuns = useListModelRunsByRequester({
    enabled: enabledQuery && !!targetNamespace,
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
    const baseColumns: ColumnDef<ModelRun>[] = [
      {
        accessorKey: "modelId",
        header: () => <div className="text-left">Model ID</div>,
        cell: ({ row }) => {
          return (
            <div className="font-normal text-semantic-bg-secondary-secondary truncate">
              <Link
                href={`/${row.original.modelNamespaceId}/models/${row.original.modelId}`}
                className="text-semantic-accent-default hover:underline"
              >
                {row.getValue("modelId")}
              </Link>
            </div>
          );
        },
      },
      {
        accessorKey: "uid",
        header: () => <div className="text-left">Run ID</div>,
        cell: ({ row }) => {
          return (
            <div className="font-normal text-semantic-bg-secondary-secondary truncate">
              <Link
                href={`/${row.original.modelNamespaceId}/models/${row.original.modelId}/runs/${row.original.uid}`}
                className="text-semantic-accent-default hover:underline"
              >
                {row.getValue("uid")}
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
          const sourceValue = row.getValue("source") as string;
          return (
            <div className="font-normal text-semantic-bg-secondary-secondary break-all">
              {sourceValue === "RUN_SOURCE_CONSOLE"
                ? "Web"
                : sourceValue === "RUN_SOURCE_API"
                  ? "API"
                  : sourceValue}
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
          const duration = row.getValue("totalDuration");
          return (
            <div className="font-normal text-semantic-bg-secondary-alt-primary">
              {duration ? `${duration}ms` : "-"}
            </div>
          );
        },
      },
      {
        accessorKey: "createTime",
        header: () => (
          <RunsTableSortableColHeader
            title="Trigger Time"
            paramName="started_time"
            currentSortParamValue={orderBy}
            onSort={onSortOrderUpdate}
          />
        ),
        cell: ({ row }) => {
          const createTime = row.getValue("createTime");
          return (
            <div className="font-normal text-semantic-bg-secondary-alt-primary">
              {createTime
                ? getHumanReadableStringFromTime(
                    createTime as string,
                    Date.now(),
                  )
                : "-"}
            </div>
          );
        },
      },
      {
        accessorKey: "runnerId",
        header: () => <div className="text-left">Runner</div>,
        cell: ({ row }) => {
          return (
            <div className="font-normal text-semantic-bg-secondary-secondary break-all">
              <Link
                target="_blank"
                href={`/${row.getValue("runnerId")}`}
                className="text-semantic-accent-default hover:underline"
              >
                {row.getValue("runnerId")}
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
        accessorKey: "requesterId",
        header: () => <div className="text-left">Credit Owner</div>,
        cell: ({ row }) => {
          return (
            <div className="font-normal text-semantic-bg-secondary-secondary break-all">
              {row.getValue("requesterId")}
            </div>
          );
        },
      },
    ];

    return baseColumns;
  }, [orderBy, targetNamespace?.id]);

  if (
    modelRuns.isSuccess &&
    (!modelRuns.data?.runs || modelRuns.data.runs.length === 0)
  ) {
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
    <div className="[&_table]:table-fixed [&_table_td]:align-top">
      <DataTable
        columns={tableColumns}
        data={modelRuns.data?.runs || []}
        pageSize={paginationState.pageSize}
        isLoading={modelRuns.isLoading}
        loadingRows={paginationState.pageSize}
        pageCount={Math.ceil(
          (modelRuns.data?.totalSize || 0) / TABLE_PAGE_SIZE,
        )}
        manualPagination={true}
        showPageNumbers
        onPaginationStateChange={setPaginationState}
        paginationState={paginationState}
      />
    </div>
  );
};
