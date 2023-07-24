import * as React from "react";
import Link from "next/link";
import { PipelineTriggerCount, GeneralStateCell } from "@instill-ai/toolkit";
import {
  Button,
  Checkbox,
  DataTable,
  Icons,
  Tag,
} from "@instill-ai/design-system";
import { ColumnDef } from "@tanstack/react-table";
import { PipelineTablePlaceholder } from "./table/PipelineTablePlaceholder";
import { TableError } from "./table/TableError";
import { Sort } from "@/lib/table";

export const getIcon = (type: Sort) => {
  if (type === "asc") {
    return <Icons.ArrowDown className="h-4 w-4 stroke-semantic-fg-secondary" />;
  }
  if (type === "desc") {
    return <Icons.ArrowUp className="h-4 w-4 stroke-semantic-fg-secondary" />;
  }
  return (
    <Icons.ChevronSelectorVertical className="h-4 w-4 stroke-semantic-fg-secondary" />
  );
};

export type DashboardPipelinesTableProps = {
  pipelineTriggerCounts: PipelineTriggerCount[];
  isError: boolean;
  isLoading: boolean;
};

export const DashboardPipelinesTable = (
  props: DashboardPipelinesTableProps
) => {
  const { pipelineTriggerCounts, isError, isLoading } = props;

  const columns: ColumnDef<PipelineTriggerCount>[] = [
    {
      accessorKey: "pipeline_id",
      header: () => <div className="min-w-[600px] text-left">Pipeline Id</div>,
      cell: ({ row }) => {
        return (
          <div className="flex min-w-[600px] flex-row gap-x-2">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
              className="h-5 w-5"
            />

            <Link
              href={`/dashboard/pipeline/${row.getValue("pipeline_id")}`}
              className="hover:underline"
            >
              {row.getValue("pipeline_id")}
            </Link>
          </div>
        );
      },
    },
    {
      accessorKey: "watchState",
      accessorFn: (row) => row.watchState,
      header: () => <div className="max-w-[80px] text-center">Status</div>,
      cell: ({ row }) => {
        return (
          <div className="text-center">
            <GeneralStateCell
              width={null}
              state={row.getValue("watchState")}
              padding="py-2"
            />
          </div>
        );
      },
    },
    {
      accessorKey: "pipeline_completed",
      header: ({ column }) => {
        return (
          <div className="min-w-[130px] text-center">
            <Button
              className="gap-x-2 py-0"
              variant="tertiaryGrey"
              size="sm"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              <span className="min-w-[130px]">Completed Triggers</span>
              {getIcon(column.getIsSorted())}
            </Button>
          </div>
        );
      },

      cell: ({ row }) => {
        return (
          <div className="text-center text-semantic-fg-secondary">
            {row.getValue("pipeline_completed")}
          </div>
        );
      },
    },
    {
      accessorKey: "pipeline_errored",
      header: ({ column }) => (
        <div className="min-w-[110px] text-center">
          <Button
            className="gap-x-2 py-0"
            variant="tertiaryGrey"
            size="sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span className="min-w-[110px]">Errored Triggers</span>
            {getIcon(column.getIsSorted())}
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="text-center text-semantic-fg-secondary">
            {row.getValue("pipeline_errored")}
          </div>
        );
      },
    },
  ];

  if (isError) {
    return (
      <DataTable
        columns={columns}
        data={pipelineTriggerCounts}
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

  if (pipelineTriggerCounts.length === 0 && !isLoading) {
    return (
      <DataTable
        columns={columns}
        data={pipelineTriggerCounts}
        pageSize={6}
        searchPlaceholder={null}
        searchKey={null}
        isLoading={isLoading}
        loadingRows={6}
      >
        <PipelineTablePlaceholder enableCreateButton={false} />
      </DataTable>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={pipelineTriggerCounts}
      pageSize={6}
      searchPlaceholder={null}
      searchKey={null}
      isLoading={isLoading}
      loadingRows={6}
    />
  );
};
