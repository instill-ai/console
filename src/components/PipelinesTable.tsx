import {
  GeneralStateCell,
  Nullable,
  PaginationListContainerProps,
  Pipeline,
  PipelineTablePlaceholder,
  PipelinesWatchState,
  TableError,
  chunk,
  env,
  useSearchedResources,
  useStateOverviewCounts,
} from "@instill-ai/toolkit";
import { ColumnDef } from "@tanstack/react-table";
import * as React from "react";
import { TableCell } from "./table/TableCell";
import { Button, DataTable, Icons } from "@instill-ai/design-system";
import { getIcon } from "./DashboardPipelinesTable";
import { formatDate } from "@/lib/table";

export type PipelinesTableProps = {
  pipelines: Pipeline[];
  pipelinesWatchState: PipelinesWatchState;
  isError: boolean;
  isLoading: boolean;
} & Pick<PaginationListContainerProps, "marginBottom">;

export const PipelinesTable = (props: PipelinesTableProps) => {
  const { pipelines, pipelinesWatchState, marginBottom, isError, isLoading } =
    props;

  const columns: ColumnDef<Pipeline>[] = [
    {
      accessorKey: "id",
      header: () => <div className="min-w-[300px] text-left">Pipelines</div>,
      cell: ({ row }) => {
        return (
          <div className="text-left">
            <TableCell
              primaryLink={`/ais/${row.getValue("id")}`}
              primaryText={row.getValue("id")}
              secondaryLink={null}
              secondaryText={null}
              iconElement={null}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "state",
      header: () => <div className="min-w-[300px] text-center"></div>,
      cell: ({ row }) => {
        return (
          <div className="flex flex-row gap-x-3">
            <GeneralStateCell
              width={null}
              state={"STATE_ACTIVE"}
              padding="py-2"
            />
            <GeneralStateCell
              width={null}
              state={"STATE_ERROR"}
              padding="py-2"
            />
            <GeneralStateCell
              width={null}
              state={"STATE_UNSPECIFIED"}
              padding="py-2"
            />
          </div>
        );
      },
    },
    {
      accessorKey: "create_time",
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
              <span className="min-w-[130px]">Date added</span>
              {getIcon(column.getIsSorted())}
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="truncate text-center text-semantic-fg-secondary product-body-text-3-regular">
            {formatDate(row.getValue("create_time"))}
          </div>
        );
      },
    },

    {
      accessorKey: "uid",
      header: () => <div className="text-center"></div>,
      cell: ({ row }) => {
        return (
          <div className="text-sm-semibold cursor-pointer truncate text-center text-semantic-error-default">
            <Icons.Trash01 className="h-5 w-5 stroke-semantic-error-default" />
          </div>
        );
      },
    },
  ];

  if (isError) {
    return (
      <DataTable
        columns={columns}
        data={pipelines}
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

  if (pipelines.length === 0 && !isLoading) {
    return (
      <DataTable
        columns={columns}
        data={pipelines}
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
      data={pipelines}
      pageSize={6}
      searchPlaceholder={null}
      searchKey={null}
      isLoading={isLoading}
      loadingRows={6}
    />
  );
};
