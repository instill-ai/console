import { ComponentRun, GeneralRecord, Nullable } from "instill-sdk";
import { convertToSecondsAndMilliseconds, formatDate, InstillStore, useInstillStore, useRouteInfo, useShallow } from "../../../../lib";
import { usePaginatedPipelineRunComponents } from "../../../../lib/react-query-service/pipeline";
import * as React from "react";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { TABLE_PAGE_SIZE } from "../constants";
import { Button, DataTable, Dialog } from "@instill-ai/design-system";
import { ModelSectionHeader, RunsTableSortableColHeader, RunStateLabel } from "../../../../components";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const PipelineRunComponents = ({ pipelineRunId }: { pipelineRunId: Nullable<string> }) => {
  const routeInfo = useRouteInfo();
  const [orderBy, setOrderBy] = React.useState<string>();
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));
  const [paginationState, setPaginationState] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: TABLE_PAGE_SIZE,
  });
  const pipelineComponentRuns = usePaginatedPipelineRunComponents({
    pipelineRunId: pipelineRunId,
    enabled: enabledQuery && routeInfo.isSuccess,
    accessToken,
  });
  const pageCount = React.useMemo(() => {
    if (!pipelineComponentRuns.data) {
      return 1;
    }

    return Math.ceil(pipelineComponentRuns.data.totalSize / pipelineComponentRuns.data.pageSize);
  }, [pipelineComponentRuns.isSuccess, pipelineComponentRuns.data]);
  const [currentOutputContent, setCurrentOutputContent] = React.useState<Nullable<{ componentId: string, content: string }>>(null);

  const onSortOrderUpdate = (sortValue: string) => {
    setPaginationState(currentValue => ({
      ...currentValue,
      pageIndex: 0,
    }));
    setOrderBy(sortValue);
  }

  const componentRunsColumns: ColumnDef<ComponentRun>[] = [
    {
      accessorKey: "componentId",
      header: () => (
        <RunsTableSortableColHeader
          title="Component ID"
          paramName="component_id"
          currentSortParamValue={orderBy}
          onSort={onSortOrderUpdate}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="font-normal text-semantic-bg-secondary-secondary break-all">
            {row.getValue("componentId")}
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
            {row.getValue("totalDuration") ? convertToSecondsAndMilliseconds(
              (row.getValue("totalDuration") as number) / 1000,
            ) : null}
          </div>
        );
      },
    },
    {
      accessorKey: "startTime",
      header: () => (
        <RunsTableSortableColHeader
          title="Start Time"
          paramName="started_time"
          currentSortParamValue={orderBy}
          onSort={onSortOrderUpdate}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="font-normal text-semantic-bg-secondary-alt-primary">
            {formatDate(row.getValue("startTime"))}
          </div>
        );
      },
    },
    {
      accessorKey: "completeTime",
      header: () => (
        <RunsTableSortableColHeader
          title="Completed Time"
          paramName="completed_time"
          currentSortParamValue={orderBy}
          onSort={onSortOrderUpdate}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="font-normal text-semantic-bg-secondary-alt-primary">
            {row.getValue("completeTime") ? formatDate(row.getValue("completeTime")) : null}
          </div>
        );
      },
    },
    {
      accessorKey: "creditAmount",
      header: () => <div className="text-left">Credits</div>,
      cell: ({ row }) => {
        return (
          <div className="font-normal text-semantic-bg-secondary-secondary break-all">
            {row.getValue("creditAmount")}
          </div>
        );
      },
    },
    {
      accessorKey: "outputs",
      header: () => <div className="text-left">Output</div>,
      cell: ({ row }) => {
        return (
          <div className="font-normal text-semantic-bg-secondary-secondary break-all">
            <Button
              size="sm"
              variant="secondaryGrey"
              onClick={() =>{
                setCurrentOutputContent({
                  componentId: row.original.componentId,
                  content: JSON.stringify((row.getValue("outputs") as GeneralRecord)[0], null, 2),
                });
              }}
            >
              JSON
            </Button>
          </div>
        );
      },
    },
  ];

  if (!pipelineComponentRuns.data?.componentRuns.length) {
    return null;
  }

  return (
    <div>
      <ModelSectionHeader className="mb-4">Component Run Metadata</ModelSectionHeader>
      <div className="[&_table]:table-fixed [&_table_td]:align-top [&_table_th]:w-40 [&_table_th:nth-child(1)]:w-auto [&_table_th:nth-child(6)]:w-28 [&_table_th:nth-child(7)]:w-32">
        <DataTable
          columns={componentRunsColumns}
          data={pipelineComponentRuns.isSuccess ? pipelineComponentRuns.data.componentRuns : []}
          pageSize={paginationState.pageSize}
          isLoading={pipelineComponentRuns.isFetching || pipelineComponentRuns.isLoading}
          loadingRows={paginationState.pageSize}
          pageCount={pageCount}
          manualPagination={true}
          showPageNumbers
          onPaginationStateChange={setPaginationState}
          paginationState={paginationState}
        />
      </div>
      <Dialog.Root open={!!currentOutputContent}>
        <Dialog.Content
          className="w-1/2 h-full overflow-hidden"
          style={{
            maxHeight: `calc(100% - 48px)`,
          }}
        >
          <Dialog.Header>
            <Dialog.Title>Component {currentOutputContent?.componentId} output</Dialog.Title>
            <Dialog.Close onClick={() => setCurrentOutputContent(null)} className="!right-6 !top-6" />
          </Dialog.Header>
          <pre className="w-full h-full overflow-auto">{currentOutputContent?.content}</pre>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  )
}