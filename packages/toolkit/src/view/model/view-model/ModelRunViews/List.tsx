"use client";

import type { Model, ModelRun, Nullable } from "instill-sdk";
import * as React from "react";
import Link from "next/link";

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
  convertToSecondsAndMilliseconds,
  InstillStore,
  useInstillStore,
  usePaginatedNamespaceModelRuns,
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

export type ModelRunListProps = {
  model?: Model;
};

const OWNER = {
  id: null,
};

export const ModelRunList = ({ model }: ModelRunListProps) => {
  const [orderBy, setOrderBy] = React.useState<Nullable<string>>(null);
  const [paginationState, setPaginationState] = React.useState<PaginationState>(
    {
      pageIndex: 0,
      pageSize: TABLE_PAGE_SIZE,
    },
  );
  const { accessToken, enabledQuery, navigationNamespaceAnchor } =
    useInstillStore(useShallow(selector));
  const routeInfo = useRouteInfo();

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

  const modelRuns = usePaginatedNamespaceModelRuns({
    accessToken,
    enabled: enabledQuery && routeInfo.isSuccess && userNamespaces.isSuccess,
    namespaceId: routeInfo.data?.namespaceId,
    modelId: routeInfo.data?.resourceId,
    pageSize: TABLE_PAGE_SIZE,
    page: paginationState.pageIndex,
    orderBy,
    requesterId: targetNamespace ? targetNamespace.id : null,
    view: "VIEW_FULL",
    filter: null,
  });

  const owner = React.useMemo(() => {
    if (!model) {
      return OWNER;
    }

    const owner = model.owner?.user || model.owner?.organization;

    if (!owner) {
      return OWNER;
    }

    return {
      id: owner.id || "",
    };
  }, [model]);

  const pageCount = React.useMemo(() => {
    if (!modelRuns.data) {
      return 1;
    }

    return Math.ceil(modelRuns.data.totalSize / modelRuns.data.pageSize);
  }, [modelRuns.data]);

  const onSortOrderUpdate = (sortValue: string) => {
    setPaginationState((currentValue) => ({
      ...currentValue,
      pageIndex: 0,
    }));
    setOrderBy(sortValue);
  };

  const columns = React.useMemo(() => {
    const columns: ColumnDef<ModelRun>[] = [
      {
        accessorKey: "uid",
        header: () => <div className="text-left">Run ID</div>,
        cell: ({ row }) => {
          return (
            <div className="font-normal text-semantic-bg-secondary-secondary whitespace-nowrap overflow-hidden text-ellipsis">
              <Link
                href={`/${owner.id}/models/${model?.id}/runs/${row.getValue("uid")}`}
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
              <Link
                href={`/${owner.id}/models/${model?.id}/playground?version=${row.getValue("version")}`}
                className="text-semantic-accent-default hover:underline"
              >
                {row.getValue("version")}
              </Link>
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
        accessorKey: "createTime",
        header: () => (
          <RunsTableSortableColHeader
            title="Trigger Time"
            paramName="create_time"
            currentSortParamValue={orderBy}
            onSort={onSortOrderUpdate}
          />
        ),
        cell: ({ row }) => {
          return (
            <div className="font-normal text-semantic-bg-secondary-alt-primary">
              {getHumanReadableStringFromTime(
                row.getValue("createTime"),
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
        header: () => <div className="text-left">Credit</div>,
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
  }, [orderBy, owner.id, model?.id]);

  if (modelRuns.isSuccess && !modelRuns.data.runs.length) {
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
            Once you run this model, they will appear here
          </span>
        </p>
      </div>
    );
  }

  return (
    <div className="[&_table]:table-fixed [&_table_td]:align-top [&_table_th]:w-40 [&_table_th:nth-child(1)]:w-auto [&_table_th:nth-child(1)]:min-w-24 [&_table_th:nth-child(7)]:w-52 [&_table_th:nth-child(8)]:w-52 [&_table_th:nth-child(9)]:w-28">
      <DataTable
        columns={columns}
        data={modelRuns.isSuccess ? modelRuns.data.runs : []}
        pageSize={paginationState.pageSize}
        isLoading={modelRuns.isFetching || modelRuns.isLoading}
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
