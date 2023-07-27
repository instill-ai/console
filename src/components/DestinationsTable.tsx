import {
  ConnectorWithPipelines,
  ConnectorsWatchState,
  DestinationTablePlaceholder,
  ImageWithFallback,
  PaginationListContainerProps,
  TableError,
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
import { formatDate, parseStatusLabel } from "@/lib/table";
import { GeneralStateCell } from "./cell/GeneralStateCell";
import { GeneralTaskCell } from "./cell";

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
                  width={16}
                  height={16}
                  alt={`${row.original.id}-icon`}
                  fallbackImg={
                    row.original.connector_definition.name
                      .split("/")[0]
                      .split("-")[0] === "source" ? (
                      <DataSourceIcon
                        width="w-4"
                        height="h-4"
                        color="fill-instillGrey90"
                        position="my-auto"
                      />
                    ) : (
                      <DataDestinationIcon
                        width="w-4"
                        height="h-4"
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
        const name: string = row.original.name;
        return (
          <div className="grid justify-items-center">
            <GeneralStateCell
              width={null}
              state={
                destinationsWatchState
                  ? destinationsWatchState[name]
                    ? destinationsWatchState[name].state
                    : "STATE_UNSPECIFIED"
                  : "STATE_UNSPECIFIED"
              }
              padding="py-2"
              label={parseStatusLabel(row.getValue("state"))}
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
        data={[]}
        pageSize={6}
        searchPlaceholder={null}
        searchKey={null}
        isLoading={isLoading}
        loadingRows={6}
        primaryText="Destination"
        secondaryText="Add and organise your Destination"
      >
        <TableError marginBottom="!border-0" />
      </DataTable>
    );
  }

  if (destinations.length === 0 && !isLoading) {
    return (
      <DataTable
        columns={columns}
        data={[]}
        pageSize={6}
        searchPlaceholder={null}
        searchKey={null}
        isLoading={isLoading}
        loadingRows={6}
        primaryText="Destination"
        secondaryText="Add and organise your Destination"
      >
        <DestinationTablePlaceholder
          enableCreateButton={false}
          marginBottom="!border-0"
        />
      </DataTable>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={destinations}
      pageSize={6}
      searchPlaceholder={"Search Destination"}
      searchKey={"id"}
      isLoading={isLoading}
      loadingRows={6}
      primaryText="Destination"
      secondaryText="Add and organise your Destination"
    />
  );
};
