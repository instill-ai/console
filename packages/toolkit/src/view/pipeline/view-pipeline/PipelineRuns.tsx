import { ColumnDef, DataTable } from "@instill-ai/design-system";

import { PipelineRunStateLabel } from "../../../components";
import {
  convertToSecondsAndMilliseconds,
  formatDate,
  InstillStore,
  Pipeline,
  PipelineTriggerRecord,
  useInstillStore,
  usePipelineTriggerRecords,
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
  const triggers = usePipelineTriggerRecords({
    enabled: enabledQuery && !!pipeline && routeInfo.isSuccess,
    filter: `pipelineId='${pipeline?.id}' AND ownerName='${routeInfo.data.namespaceName}'`,
    accessToken,
    previousFilter: null,
    filterId: null,
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
  console.log(triggers);
  return (
    <div className="[&_table]:table-fixed [&_table_td]:align-top [&_table_th:nth-child(1)]:w-auto [&_table_th:nth-child(2)]:w-40 [&_table_th:nth-child(3)]:w-40 [&_table_th:nth-child(4)]:w-36">
      <DataTable
        columns={columns}
        data={triggers.data?.triggers || []}
        pageSize={TABLE_PAGE_SIZE}
        isLoading={!triggers.isSuccess}
        loadingRows={TABLE_PAGE_SIZE}
      />
    </div>
  );
};
