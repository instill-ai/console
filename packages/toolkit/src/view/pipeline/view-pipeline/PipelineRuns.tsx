import type { Pipeline } from "instill-sdk";

import { ColumnDef, DataTable } from "@instill-ai/design-system";

import {
  EmptyView,
  LoadingSpin,
  PipelineRunStateLabel,
} from "../../../components";
import {
  convertToSecondsAndMilliseconds,
  formatDate,
  InstillStore,
  PipelineTriggerRecord,
  useInstillStore,
  usePipelineTriggers,
  useRouteInfo,
  useShallow,
} from "../../../lib";
import { TABLE_PAGE_SIZE } from "./constants";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export type PipelineRunsProps = {
  pipeline?: Pipeline;
};

export const PipelineRuns = ({ pipeline }: PipelineRunsProps) => {
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));
  const routeInfo = useRouteInfo();
  const triggers = usePipelineTriggers({
    enabled: enabledQuery && !!pipeline && routeInfo.isSuccess,
    filter: `pipelineId='${pipeline?.id}' AND ownerName='${routeInfo.data.namespaceName}'`,
    accessToken,
    filterId: `${pipeline?.id}-${routeInfo.data.namespaceName}`,
  });

  const columns: ColumnDef<PipelineTriggerRecord>[] = [
    {
      accessorKey: "pipelineTriggerId",
      header: () => <div className="text-left">Run ID</div>,
      cell: ({ row }) => {
        return (
          <div className="font-normal text-semantic-bg-secondary-secondary break-all">
            {row.getValue("pipelineTriggerId")}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => <div className="text-left">State</div>,
      cell: ({ row }) => {
        return (
          <PipelineRunStateLabel
            state={row.getValue("status")}
            className="inline-flex"
          />
        );
      },
    },
    {
      accessorKey: "computeTimeDuration",
      header: () => <div className="text-left">Trigger Time</div>,
      cell: ({ row }) => {
        return (
          <div className="font-normal text-semantic-bg-secondary-alt-primary">
            {convertToSecondsAndMilliseconds(
              row.getValue("computeTimeDuration"),
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "triggerTime",
      header: () => <div className="text-left">Timestamp</div>,
      cell: ({ row }) => {
        return (
          <div className="font-normal text-semantic-bg-secondary-alt-primary">
            {formatDate(row.getValue("triggerTime"))}
          </div>
        );
      },
    },
  ];

  if (triggers.isPending) {
    return <LoadingSpin className="!m-0 !text-semantic-fg-secondary" />;
  }

  if (triggers.isSuccess && triggers.data.length === 0) {
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
    <div className="[&_table]:table-fixed [&_table_td]:align-top [&_table_th:nth-child(1)]:w-auto [&_table_th:nth-child(2)]:w-40 [&_table_th:nth-child(3)]:w-40 [&_table_th:nth-child(4)]:w-36">
      <DataTable
        columns={columns}
        data={triggers.data ?? []}
        pageSize={TABLE_PAGE_SIZE}
        isLoading={!triggers.isSuccess}
        loadingRows={TABLE_PAGE_SIZE}
      />
    </div>
  );
};
