import * as React from "react";
import type { Pipeline, PipelineRun } from "instill-sdk";
import { ColumnDef, DataTable, Icons, PaginationState } from "@instill-ai/design-system";
import {
  EmptyView,
  LoadingSpin,
  RunStateLabel,
} from "../../../../components";
import {
  convertToSecondsAndMilliseconds,
  InstillStore,
  useInstillStore,
  useRouteInfo,
  useShallow,
} from "../../../../lib";
import Link from "next/link";
import { usePaginatedPipelineRuns } from "../../../../lib/react-query-service/pipeline";
import { TABLE_PAGE_SIZE } from "../constants";
import { getHumanReadableStringFromTime } from "../../../../server";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export type PipelineRunListProps = {
  pipeline?: Pipeline;
};

type Sort = "asc" | "desc" | undefined;

const getIcon = (type: Sort) => {
  switch (type) {
    case 'asc': return <Icons.ArrowDown className="h-4 w-4 stroke-semantic-fg-secondary" />;
    case 'desc': return <Icons.ArrowUp className="h-4 w-4 stroke-semantic-fg-secondary" />;
    default: return <Icons.ChevronSelectorVertical className="h-4 w-4 stroke-semantic-fg-secondary" />;
  }
};

export const PipelineRunList = ({ pipeline }: PipelineRunListProps) => {
  const [orderBy, setOrderBy] = React.useState<string>();
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));
  const routeInfo = useRouteInfo();
  const [paginationState, setPaginationState] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: TABLE_PAGE_SIZE,
  });
  const pipelineRuns = usePaginatedPipelineRuns({
    pipelineName: `namespaces/${routeInfo.data.namespaceId}/pipelines/${routeInfo.data.resourceId}`,
    enabled: enabledQuery && routeInfo.isSuccess,
    accessToken,
    pageSize: TABLE_PAGE_SIZE,
    page: paginationState.pageIndex,
    orderBy,
    //fullView: true,
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

  const columns = React.useMemo(() => {
    const columns: ColumnDef<PipelineRun>[] = [
      {
        accessorKey: "pipelineRunUid",
        header: () => <div className="text-left">Run ID</div>,
        cell: ({ row }) => {
          return (
            <div className="font-normal text-semantic-bg-secondary-secondary break-all">
              <Link href={`/${ownerId}/pipelines/${pipeline?.id}/runs/${row.getValue("pipelineRunUid")}`} className="text-semantic-accent-default hover:underline">{row.getValue("pipelineRunUid")}</Link>
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
              <Link href={`/${ownerId}/pipelines/${pipeline?.id}/playground?version=${row.getValue("pipelineVersion")}`} className="text-semantic-accent-default hover:underline">{row.getValue("pipelineVersion")}</Link>
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
        accessorKey: "startTime",
        header: () => {
          const sortParam = 'start_time';
          const orderedParams = orderBy?.split(' ');
          const isOrderedByStartTime = orderedParams?.[0] ===  sortParam;
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
              Trigger Time
              {getIcon(isOrderedByStartTime ? currentOrder : undefined)}
            </div>
          );
        },
        cell: ({ row }) => {
          return (
            <div className="font-normal text-semantic-bg-secondary-alt-primary">
              {getHumanReadableStringFromTime(row.getValue("startTime"), Date.now())}
            </div>
          );
        },
      },
      {
        accessorKey: "requesterId",
        header: () => <div className="text-left">Runner</div>,
        cell: ({ row }) => {
          return (
            <div className="font-normal text-semantic-bg-secondary-secondary break-all">
              {row.getValue("requesterId")}
            </div>
          );
        },
      },
    ];

    if (pipelineRuns.data && pipelineRuns.data.pipelineRuns[0] && 'credits' in pipelineRuns.data.pipelineRuns[0] && pipelineRuns.data.pipelineRuns[0].credits !== null) {
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

  return (
    <div className="[&_table]:table-fixed [&_table_td]:align-top [&_table_th]:w-40 [&_table_th:nth-child(1)]:w-auto [&_table_th:nth-child(7)]:w-52 [&_table_th:nth-child(8)]:w-28">
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
