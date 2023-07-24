import { DataTable } from "@instill-ai/design-system";
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
      header: () => <div className="min-w-[400px] text-left">Pipeline Id</div>,
      cell: ({ row }) => {
        return (
          <div className="flex flex-row gap-x-2">
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
      header: () => {
        return (
          <div className="min-w-[150px] text-center">Trigger Duration</div>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="text-center">
            <p className="truncate text-semantic-fg-secondary product-body-text-3-regular">
              {convertToSecondsAndMilliseconds(
                row.getValue("compute_time_duration")
              )}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "pipeline_trigger_id",
      header: () => <div className="min-w-[350px] text-center">Trigger ID</div>,
      cell: ({ row }) => {
        return (
          <div className="text-center">
            <p className="truncate text-semantic-fg-secondary product-body-text-3-regular">
              {row.getValue("pipeline_trigger_id")}
            </p>
          </div>
        );
      },
    },
  ];

  if (isError) {
    return (
      <DataTable
        columns={columns}
        data={pipelineTriggers}
        pageSize={6}
        searchPlaceholder={null}
        searchKey={null}
        isLoading={isLoading}
        loadingRows={6}
      >
        <TableError />
      </DataTable>
    );
  }

  if (pipelineTriggers.length === 0 && !isLoading) {
    return (
      <DataTable
        columns={columns}
        data={pipelineTriggers}
        pageSize={6}
        searchPlaceholder={null}
        searchKey={null}
        isLoading={isLoading}
        loadingRows={6}
      >
        <TriggersTablePlaceholder enableCreateButton={false} />
      </DataTable>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={pipelineTriggers}
      pageSize={6}
      searchPlaceholder={null}
      searchKey={null}
      isLoading={isLoading}
      loadingRows={6}
    />
  );
};
