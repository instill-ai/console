import {
  ConnectorWithPipelines,
  ConnectorsWatchState,
  DestinationTablePlaceholder,
  GeneralStateCell,
  ImageWithFallback,
  PaginationListContainerProps,
  TableError,
  parseTriggerStatusLabel,
} from "@instill-ai/toolkit";
import { ColumnDef } from "@tanstack/react-table";
import * as React from "react";
import { TableCell } from "./table/TableCell";
import {
  Button,
  DataDestinationIcon,
  DataSourceIcon,
  DataTable,
} from "@instill-ai/design-system";
import { getIcon } from "./DashboardPipelinesTable";
import { formatDate } from "@/lib/table";

export type DestinationsTableProps = {
  destinations: ConnectorWithPipelines[];
  destinationsWatchState: ConnectorsWatchState;
  isError: boolean;
  isLoading: boolean;
} & Pick<PaginationListContainerProps, "marginBottom">;

export const DestinationsTable = (props: DestinationsTableProps) => {
  const {
    destinations,
    destinationsWatchState,
    isError,
    isLoading,
    marginBottom,
  } = props;

  const columns: ColumnDef<ConnectorWithPipelines>[] = [
    {
      accessorKey: "id",
      header: () => <div className="min-w-[300px] text-left">Output Name</div>,
      cell: ({ row }) => {
        return (
          <div className="text-left">
            <TableCell
              primaryLink={`/destinations/${row.getValue("id")}`}
              primaryText={row.getValue("id")}
              secondaryLink={null}
              secondaryText={row.original.connector_definition.title}
              iconElement={
                <ImageWithFallback
                  src={`/icons/${row.original.connector_definition.vendor}/${row.original.connector_definition.icon}`}
                  width={24}
                  height={24}
                  alt={`${row.original.id}-icon`}
                  fallbackImg={
                    row.original.connector_definition.name
                      .split("/")[0]
                      .split("-")[0] === "source" ? (
                      <DataSourceIcon
                        width="w-6"
                        height="h-6"
                        color="fill-instillGrey90"
                        position="my-auto"
                      />
                    ) : (
                      <DataDestinationIcon
                        width="w-6"
                        height="h-6"
                        color="fill-instillGrey90"
                        position="my-auto"
                      />
                    )
                  }
                />
              }
            />
          </div>
        );
      },
    },
    {
      accessorKey: "task",
      header: () => <div className="text-center">Data type</div>,
      cell: ({ row }) => {
        return (
          <div className="text-center text-semantic-fg-secondary product-body-text-3-regular">
            {row.getValue("task")}
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
      accessorKey: "state",
      header: () => <div className="text-center">Status</div>,
      cell: ({ row }) => {
        return (
          <div className="grid justify-items-center">
            <GeneralStateCell
              width={null}
              state={row.getValue("state")}
              padding="py-2"
              label={parseTriggerStatusLabel(row.getValue("state"))}
            />
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
            Delete
          </div>
        );
      },
    },
  ];

  if (isError) {
    return (
      <DataTable
        columns={columns}
        data={destinations}
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

  if (destinations.length === 0 && !isLoading) {
    return (
      <DataTable
        columns={columns}
        data={destinations}
        pageSize={6}
        searchPlaceholder={null}
        searchKey={null}
        isLoading={isLoading}
        loadingRows={6}
      >
        <DestinationTablePlaceholder enableCreateButton={false} />
      </DataTable>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={destinations}
      pageSize={6}
      searchPlaceholder={null}
      searchKey={null}
      isLoading={isLoading}
      loadingRows={6}
    />
  );
};
