"use client";

import type { Nullable, Pipeline, PipelineRun } from "instill-sdk";
import * as React from "react";
import Link from "next/link";

import {
  ColumnDef,
  DataTable,
  PaginationState,
} from "@instill-ai/design-system";

import {
  EmptyView,
  LoadingSpin,
  RunsTableSortableColHeader,
  RunStateLabel,
} from "../../../../components";
import {
  convertToSecondsAndMilliseconds,
  InstillStore,
  useInstillStore,
  usePaginatedNamespacePipelineRuns,
  useRouteInfo,
  useShallow,
  useUserNamespaces,
} from "../../../../lib";
import { env, getHumanReadableStringFromTime } from "../../../../server";
import { TABLE_PAGE_SIZE } from "../constants";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  navigationNamespaceAnchor: store.navigationNamespaceAnchor,
});

export type PipelineRunListProps = {
  pipeline?: Pipeline;
};

export const PipelineRunList = ({ pipeline }: PipelineRunListProps) => {
  const [orderBy, setOrderBy] = React.useState<Nullable<string>>(null);
  const { accessToken, enabledQuery, navigationNamespaceAnchor } =
    useInstillStore(useShallow(selector));
  const routeInfo = useRouteInfo();
  const [paginationState, setPaginationState] = React.useState<PaginationState>(
    {
      pageIndex: 0,
      pageSize: TABLE_PAGE_SIZE,
    },
  );

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

  const pipelineRuns = usePaginatedNamespacePipelineRuns({
    namespaceId: routeInfo.data.namespaceId,
    pipelineId: routeInfo.data.resourceId,
    enabled: enabledQuery && routeInfo.isSuccess && userNamespaces.isSuccess,
    accessToken,
    pageSize: TABLE_PAGE_SIZE,
    page: paginationState.pageIndex,
    orderBy,
    requesterId: targetNamespace ? targetNamespace.id : null,
    view: "VIEW_FULL",
    filter: null,
  });

  const ownerId = React.useMemo(() => {
    return pipeline?.name.split("/")[1];
  }, [pipeline]);

  const pageCount = React.useMemo(() => {
    if (!pipelineRuns.data) {
      return 1;
    }

    return Math.ceil(pipelineRuns.data.totalSize / pipelineRuns.data.pageSize);
  }, [pipelineRuns.isSuccess, pipelineRuns.data]);

  const onSortOrderUpdate = (sortValue: string) => {
    setPaginationState((currentValue) => ({
      ...currentValue,
      pageIndex: 0,
    }));
    setOrderBy(sortValue);
  };

  const columns = React.useMemo(() => {
    const columns: ColumnDef<PipelineRun>[] = [
      {
        accessorKey: "pipelineRunUid",
        header: () => <div className="text-left">Run ID</div>,
        cell: ({ row }) => {
          return (
            <div className="font-normal text-semantic-bg-secondary-secondary whitespace-nowrap overflow-hidden text-ellipsis">
              <Link
                href={`/${ownerId}/pipelines/${pipeline?.id}/runs/${row.getValue("pipelineRunUid")}`}
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
          let content: React.ReactNode = `Unversioned`;
          const version = row.getValue("pipelineVersion");

          if (version !== "latest") {
            content = (
              <Link
                href={`/${ownerId}/pipelines/${pipeline?.id}/playground?version=${version}`}
                className="text-semantic-accent-default hover:underline"
              >
                {row.getValue("pipelineVersion")}
              </Link>
            );
          }

          return (
            <div className="font-normal text-semantic-bg-secondary-secondary break-all">
              {content}
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: () => <div className="text-left">State</div>,
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
              {row.getValue("source") === "RUN_SOURCE_CONSOLE" ? "Web" : "API"}
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
              {convertToSecondsAndMilliseconds(
                ((row.getValue("totalDuration") as number) || 0) / 1000,
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "startTime",
        header: () => (
          <RunsTableSortableColHeader
            title="Trigger Time"
            paramName="started_time"
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
        accessorKey: "runnerId",
        header: () => <div className="text-left">Runner</div>,
        cell: ({ row }) => {
          return (
            <div className="font-normal text-semantic-bg-secondary-secondary break-all">
              <Link
                target="_blank"
                className="text-semantic-accent-default hover:underline"
                href={`/${row.getValue("runnerId")}`}
              >
                {row.getValue("runnerId")}
              </Link>
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
              <Link
                target="_blank"
                className="text-semantic-accent-default hover:underline"
                href={`/${row.getValue("requesterId")}`}
              >
                {row.getValue("requesterId")}
              </Link>
            </div>
          );
        },
      },
    ];

    if (env("NEXT_PUBLIC_APP_ENV") === "CLOUD") {
      columns.push({
        accessorKey: "creditAmount",
        header: () => <div className="text-left">Credits</div>,
        cell: ({ row }) => {
          return (
            <div className="font-normal text-semantic-bg-secondary-secondary break-all">
              {row.getValue("creditAmount")}
            </div>
          );
        },
      });
    }

    return columns;
  }, [pipelineRuns.isSuccess, pipelineRuns.data]);

  if (pipelineRuns.isPending) {
    return <LoadingSpin className="!m-0 !text-semantic-fg-secondary" />;
  }

  if (pipelineRuns.isSuccess && pipelineRuns.data.pipelineRuns.length === 0) {
    return (
      <EmptyView
        iconName="Zap"
        title="No runs yet"
        description="This pipeline hasn't been run yet."
        className="flex-1"
      />
    );
  }

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
          <span className="whitespace-nowrap">No run logs found</span>
          <span className="text-base font-normal text-semantic-fg-secondary">
            Once you run this pipeline, they will appear here
          </span>
        </p>
      </div>
    );
  }

  return (
    <div className="[&_table]:table-fixed [&_table_td]:align-top [&_table_th]:w-40 [&_table_th:nth-child(1)]:w-auto [&_table_th:nth-child(7)]:w-52 [&_table_th:nth-child(8)]:w-52 [&_table_th:nth-child(9)]:w-28">
      <DataTable
        columns={columns}
        data={pipelineRuns.isSuccess ? pipelineRuns.data.pipelineRuns : []}
        pageSize={paginationState.pageSize}
        isLoading={pipelineRuns.isFetching || pipelineRuns.isLoading}
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
