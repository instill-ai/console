"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Button, DataTable } from "@instill-ai/design-system";
import { SortIcon, TableError } from "../../components";
import { TriggeredPipeline } from "../../lib";
import { PipelineTablePlaceholder } from "../pipeline";

export type DashboardPipelinesTableProps = {
  pipelineTriggerCounts: TriggeredPipeline[];
  isError: boolean;
  isLoading: boolean;
  costView: "model" | "pipeline";
};

export const DashboardPipelinesTable = (
  props: DashboardPipelinesTableProps
) => {
  const { entity, days } = useParams();
  const { pipelineTriggerCounts, isError, isLoading, costView } = props;

  const columns: ColumnDef<TriggeredPipeline>[] = [
    {
      accessorKey: costView === "pipeline" ? "pipelineId" : "modelId",
      header: () => (
        <div className="min-w-[450px] text-left">
          {costView === "pipeline" ? "Pipeline Id" : "Model Id"}
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex flex-row">
            <Link
              href={`/${entity}/dashboard/${costView}/${row.getValue(
                costView === "pipeline" ? "pipelineId" : "modelId"
              )}${days ? "?days=" + days : ""}`}
            >
              {row.getValue(costView === "pipeline" ? "pipelineId" : "modelId")}
            </Link>
          </div>
        );
      },
    },
    {
      accessorKey: "version",
      header: () => <div className="text-center">Version</div>,
      cell: ({ row }) => {
        return (
          <div className="truncate text-center text-semantic-fg-secondary product-body-text-3-regular">
            {row.getValue("version")}
          </div>
        );
      },
    },
    {
      accessorKey: "duration",
      header: ({ column }) => {
        return (
          <div className="text-center">
            <Button
              className="gap-x-2 py-0"
              variant="tertiaryGrey"
              size="sm"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              <span className="min-w-[130px">Duration</span>
              <SortIcon type={column.getIsSorted()} />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="truncate text-center text-semantic-fg-secondary product-body-text-3-regular">
            {row.getValue("duration")}
          </div>
        );
      },
    },
    {
      accessorKey: "creditCost",
      header: ({ column }) => (
        <div className="text-center">
          <Button
            className="gap-x-2 py-0"
            variant="tertiaryGrey"
            size="sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span className="min-w-[110px]">Credit Cost</span>
            <SortIcon type={column.getIsSorted()} />
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="truncate text-center text-semantic-fg-secondary product-body-text-3-regular">
            {row.getValue("creditCost")}
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
        primaryText={costView === "pipeline" ? "Pipelines" : "Models"}
      >
        <TableError marginBottom="!border-0" />
      </DataTable>
    );
  }

  if (pipelineTriggerCounts.length === 0 && !isLoading) {
    return (
      <DataTable
        columns={columns}
        data={[]}
        pageSize={6}
        searchPlaceholder={null}
        searchKey={null}
        isLoading={isLoading}
        loadingRows={6}
        primaryText={costView === "pipeline" ? "Pipelines" : "Models"}
        secondaryText={`Select ${costView === "pipeline" ? "pipelines" : "models"
          } from the table below to view the cost details`}
      >
        <PipelineTablePlaceholder
          enableCreateButton={false}
          marginBottom="!border-0"
        />
      </DataTable>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={pipelineTriggerCounts}
      pageSize={6}
      searchPlaceholder={`Search ${costView === "pipeline" ? "Pipelines" : "Models"
        }`}
      searchKey={costView === "pipeline" ? "pipelineId" : "modelId"}
      isLoading={isLoading}
      loadingRows={6}
      primaryText={costView === "pipeline" ? "Pipelines" : "Models"}
      secondaryText={`Select ${costView === "pipeline" ? "pipelines" : "models"
        } from the table below to view the cost details`}
    />
  );
};