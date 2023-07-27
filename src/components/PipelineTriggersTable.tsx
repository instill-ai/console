import { Button, DataTable } from "@instill-ai/design-system";
import {
  GeneralStateCell,
  PipelineTriggerRecord,
  TableError,
  convertTimestamp,
  convertToSecondsAndMilliseconds,
  parseTriggerStatusLabel,
} from "@instill-ai/toolkit";
import { ColumnDef } from "@tanstack/react-table";
import * as React from "react";
import { TriggersTablePlaceholder } from "./table/TriggersTablePlaceholder";
import { getIcon } from "./DashboardPipelinesTable";

export type PipelineTriggersTableProps = {
  pipelineTriggers: PipelineTriggerRecord[];
  isError: boolean;
  isLoading: boolean;
};

export const PipelineTriggersTable = (props: PipelineTriggersTableProps) => {
  const { pipelineTriggers, isError, isLoading } = props;

  const columns: ColumnDef<PipelineTriggerRecord>[] = [
    {
      accessorKey: "trigger_time",
      header: () => <div className="min-w-[400px] text-left">Timestamp</div>,
      cell: ({ row }) => {
        return (
          <div className="text-left">
            {convertTimestamp(row.getValue("trigger_time"))}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => <div className="max-w-[100px] text-center">Status</div>,
      cell: ({ row }) => {
        return (
          <div className="text-center">
            <GeneralStateCell
              width={null}
              state={row.getValue("status")}
              padding="py-2"
              label={parseTriggerStatusLabel(row.getValue("status"))}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "compute_time_duration",
      header: ({ column }) => {
        return (
          <div className="min-w-[150px] text-center">
            <Button
              className="gap-x-2 py-0"
              variant="tertiaryGrey"
              size="sm"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              <span className="min-w-[130px]">Trigger Duration</span>
              {getIcon(column.getIsSorted())}
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="truncate text-center text-semantic-fg-secondary product-body-text-3-regular">
            {convertToSecondsAndMilliseconds(
              row.getValue("compute_time_duration")
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "pipeline_trigger_id",
      header: () => <div className="min-w-[350px] text-center">Trigger ID</div>,
      cell: ({ row }) => {
        return (
          <div className="truncate text-center text-semantic-fg-secondary product-body-text-3-regular">
            {row.getValue("pipeline_trigger_id")}
          </div>
        );
      },
    },
  ];

  if (isError) {
    return (
      <DataTable
        columns={columns}
        data={[]}
        pageSize={6}
        searchPlaceholder={null}
        searchKey={null}
        isLoading={isLoading}
        loadingRows={6}
        primaryText={null}
        secondaryText="Pipeline triggers"
      >
        <TableError marginBottom="!border-0" />
      </DataTable>
    );
  }

  if (pipelineTriggers.length === 0 && !isLoading) {
    return (
      <DataTable
        columns={columns}
        data={[]}
        pageSize={6}
        searchPlaceholder={null}
        searchKey={null}
        isLoading={isLoading}
        loadingRows={6}
        primaryText={null}
        secondaryText="Pipeline triggers"
      >
        <TriggersTablePlaceholder enableCreateButton={false} marginBottom="!border-0"/>
      </DataTable>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={pipelineTriggers}
      pageSize={6}
      searchPlaceholder={"Search Triggers"}
      searchKey={null}
      isLoading={isLoading}
      loadingRows={6}
      primaryText={null}
      secondaryText="Pipeline triggers"
    />
  );
};
