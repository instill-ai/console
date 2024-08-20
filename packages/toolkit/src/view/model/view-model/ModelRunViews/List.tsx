import * as React from "react";
import type { Model } from "instill-sdk";

import { ColumnDef, DataTable, Icons, PaginationState } from "@instill-ai/design-system";
import {
  convertToSecondsAndMilliseconds,
  InstillStore,
  ModelRun,
  useInstillStore,
  usePaginatedModelRuns,
  useRouteInfo,
  useShallow,
} from "../../../../lib";
import { TABLE_PAGE_SIZE } from "../constants";
import Link from "next/link";
import { RunStateLabel } from "../../../../components";
import { getHumanReadableStringFromTime } from "../../../../server";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export type ModelRunListProps = {
  model?: Model;
};

const OWNER = {
  id: null,
};

type Sort = "asc" | "desc" | undefined;

const getIcon = (type: Sort) => {
  switch (type) {
    case 'asc': return <Icons.ArrowDown className="h-4 w-4 stroke-semantic-fg-secondary" />;
    case 'desc': return <Icons.ArrowUp className="h-4 w-4 stroke-semantic-fg-secondary" />;
    default: return <Icons.ChevronSelectorVertical className="h-4 w-4 stroke-semantic-fg-secondary" />;
  }
};

export const ModelRunList = ({ model }: ModelRunListProps) => {
  const [orderBy, setOrderBy] = React.useState<string>();
  const [paginationState, setPaginationState] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: TABLE_PAGE_SIZE,
  });
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));
  const routeInfo = useRouteInfo();
  const modelRuns = usePaginatedModelRuns({
    accessToken,
    enabled: enabledQuery && routeInfo.isSuccess,
    modelName: `namespaces/${routeInfo.data.namespaceId}/models/${routeInfo.data.resourceId}`,
    pageSize: TABLE_PAGE_SIZE,
    page: paginationState.pageIndex,
    orderBy,
  });

  const owner = React.useMemo(() => {
    if (!model) {
      return OWNER;
    }

    const owner = model.owner?.user || model.owner?.organization;

    if (!owner || !owner.profile) {
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
  }, [modelRuns.isSuccess, modelRuns.data]);

  const columns = React.useMemo(() => {
    const columns: ColumnDef<ModelRun>[] = [
      {
        accessorKey: "uid",
        header: () => <div className="text-left">Run ID</div>,
        cell: ({ row }) => {
          return (
            <div className="font-normal text-semantic-bg-secondary-secondary break-all">
              <Link href={`/${owner.id}/models/${model?.id}/runs/${row.getValue("uid")}`} className="text-semantic-accent-default hover:underline">{row.getValue("uid")}</Link>
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
              <Link href={`/${owner.id}/models/${model?.id}/playground?version=${row.getValue("version")}`} className="text-semantic-accent-default hover:underline">{row.getValue("version")}</Link>
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
              {row.getValue("source") === 'RUN_SOURCE_CONSOLE' ? "Web" : "API"}
            </div>
          );
        },
      },
      {
        accessorKey: "totalDuration",
        header: () => <div className="text-left">Total Duration</div>,
        cell: ({ row }) => {
          return (
            <div className="font-normal text-semantic-bg-secondary-alt-primary">
              {convertToSecondsAndMilliseconds(
                row.getValue("totalDuration"),
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "createTime",
        header: () => {
          const sortParam = 'create_time';
          const orderedParams = orderBy?.split(' ');
          const isOrderedByCreateTime = orderedParams?.[0] ===  sortParam;
          const currentOrder = orderedParams?.[1] as Sort;

          return (
            <div
              className="flex flex-row items-center gap-x-1 cursor-pointer"
              onClick={() => {
                setPaginationState(currentValue => ({
                  ...currentValue,
                  pageIndex: 0,
                }));
                setOrderBy(`${sortParam} ${currentOrder === 'asc' ? 'desc' : 'asc'}`);
              }}
            >
              Created
              {getIcon(isOrderedByCreateTime ? currentOrder : undefined)}
            </div>
          );
        },
        cell: ({ row }) => {
          return (
            <div className="font-normal text-semantic-bg-secondary-alt-primary">
              {getHumanReadableStringFromTime(row.getValue("createTime"), Date.now())}
            </div>
          );
        },
      },
      {
        accessorKey: "requesterId",
        header: () => <div className="text-left">Runner</div>,
        cell: ({ row }) => {
          return (
            <div className="font-normal text-semantic-bg-secondary-secondary break-all first-letter:uppercase">
              {row.getValue("requesterId") ? '' : 'Not '}you
            </div>
          );
        },
      },
    ];

    if (modelRuns.data && modelRuns.data.runs[0] && 'credits' in modelRuns.data.runs[0] && modelRuns.data.runs[0].credits !== null) {
      columns.push({
        accessorKey: "credits",
        header: () => <div className="text-left">Credit</div>,
        cell: ({ row }) => {
          return (
            <div className="font-normal text-semantic-bg-secondary-secondary break-all">
              {row.getValue("credits")}
            </div>
          );
        },
      });
    }

    return columns;
  }, [modelRuns.isSuccess, modelRuns.data, orderBy]);

  return (
    <div className="[&_table]:table-fixed [&_table_td]:align-top [&_table_th]:w-40 [&_table_th:nth-child(1)]:w-auto [&_table_th:nth-child(7)]:w-24 [&_table_th:nth-child(8)]:w-28">
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
