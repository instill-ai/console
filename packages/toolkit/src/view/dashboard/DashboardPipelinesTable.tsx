import Link from "next/link";
import { useRouter } from "next/router";
import { Button, Checkbox, DataTable } from "@instill-ai/design-system";
import { ColumnDef } from "@tanstack/react-table";

import { TriggeredPipeline } from "../../lib";
import { SortIcon, TableError } from "../../components";
import { PipelineTablePlaceholder } from "../pipeline";

export type DashboardPipelinesTableProps = {
  pipelineTriggerCounts: TriggeredPipeline[];
  isError: boolean;
  isLoading: boolean;
};

export const DashboardPipelinesTable = (
  props: DashboardPipelinesTableProps
) => {
  const router = useRouter();
  const { entity } = router.query;
  const { days } = router.query;
  const { pipelineTriggerCounts, isError, isLoading } = props;

  const columns: ColumnDef<TriggeredPipeline>[] = [
    {
      accessorKey: "pipeline_id",
      header: () => <div className="min-w-[450px] text-left">Pipeline Id</div>,
      cell: ({ row }) => {
        return (
          <div className="flex flex-row">
            {/* <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
              className="h-5 w-5"
            /> */}
            <Link
              href={`/${entity}/dashboard/pipeline/${row.getValue(
                "pipeline_id"
              )}${days ? "?days=" + days : ""}`}
              className="hover:underline"
            >
              {row.getValue("pipeline_id")}
            </Link>
          </div>
        );
      },
    },
    {
      accessorKey: "trigger_count_completed",
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
              <span className="min-w-[130px]">Completed Triggers</span>
              <SortIcon type={column.getIsSorted()} />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="truncate text-center text-semantic-fg-secondary product-body-text-3-regular">
            {row.getValue("trigger_count_completed")}
          </div>
        );
      },
    },
    {
      accessorKey: "trigger_count_errored",
      header: ({ column }) => (
        <div className="text-center">
          <Button
            className="gap-x-2 py-0"
            variant="tertiaryGrey"
            size="sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span className="min-w-[110px]">Errored Triggers</span>
            <SortIcon type={column.getIsSorted()} />
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="truncate text-center text-semantic-fg-secondary product-body-text-3-regular">
            {row.getValue("trigger_count_errored")}
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
        primaryText="Pipelines"
        secondaryText="Select pipelines from the table below to view the number of pipeline triggers"
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
        primaryText="Pipelines"
        secondaryText="Select pipelines from the table below to view the number of pipeline triggers"
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
      searchPlaceholder={"Search Pipelines"}
      searchKey={"pipeline_id"}
      isLoading={isLoading}
      loadingRows={6}
      primaryText="Pipelines"
      secondaryText="Select pipelines from the table below to view the number of pipeline triggers"
    />
  );
};
