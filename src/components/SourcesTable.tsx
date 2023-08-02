import {
  Button,
  DataDestinationIcon,
  DataSourceIcon,
  DataTable,
  Dialog,
  useToast,
} from "@instill-ai/design-system";
import {
  ConnectorWithDefinition,
  ConnectorWithPipelines,
  ConnectorsWatchState,
  GeneralDeleteResourceModal,
  GeneralStateCell,
  ImageWithFallback,
  Model,
  Nullable,
  PaginationListContainerProps,
  Pipeline,
  SortIcon,
  SourceTablePlaceholder,
  TableCell,
  TableError,
  formatDate,
  getInstillApiErrorMessage,
  parseStatusLabel,
  useDeleteConnector,
} from "@instill-ai/toolkit";
import { ColumnDef } from "@tanstack/react-table";
import { isAxiosError } from "axios";
import React from "react";

export type SourcesTableProps = {
  sources: ConnectorWithPipelines[];
  sourcesWatchState: ConnectorsWatchState;
  isError: boolean;
  isLoading: boolean;
} & Pick<PaginationListContainerProps, "marginBottom">;

export const SourcesTable = (props: SourcesTableProps) => {
  const { sources, sourcesWatchState, marginBottom, isError, isLoading } =
    props;

  const deleteConnector = useDeleteConnector();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDeleteOperator = (
    resource: Nullable<ConnectorWithDefinition | Pipeline | Model>
  ) => {
    if (!resource) return;
    setIsDeleting(true);
    deleteConnector.mutate(
      {
        connectorName: resource.name,
        accessToken: null,
      },
      {
        onSuccess: () => {
          setIsDeleting(false);
          toast({
            title: "Data deleted",
            variant: "alert-success",
            size: "large",
          });
        },
        onError: (error) => {
          setIsDeleting(false);
          if (isAxiosError(error)) {
            toast({
              title: "Something went wrong when delete the Data",
              description: getInstillApiErrorMessage(error),
              variant: "alert-error",
              size: "large",
            });
          } else {
            toast({
              title: "Something went wrong when delete the Data",
              variant: "alert-error",
              description: "Please try again later",
              size: "large",
            });
          }
        },
      }
    );
  };

  const columns: ColumnDef<ConnectorWithPipelines>[] = [
    {
      accessorKey: "id",
      header: () => <div className="min-w-[300px] text-left">Output Name</div>,
      cell: ({ row }) => {
        return (
          <div className="text-left">
            <TableCell
              primaryLink={`/operators/${row.getValue("id")}`}
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
                      .split("-")[0] === "operator" ? (
                      <DataSourceIcon
                        width="w-4"
                        height="h-4"
                        color="fill-semantic-bg-secondary-base-bg"
                        position="my-auto"
                      />
                    ) : (
                      <DataDestinationIcon
                        width="w-4"
                        height="h-4"
                        color="fill-semantic-bg-secondary-base-bg"
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
              <SortIcon type={column.getIsSorted()} />
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
        console.log("STATE_CONNECTED", parseStatusLabel(row.getValue("state")));

        return (
          <div className="grid justify-items-center">
            <GeneralStateCell
              width={null}
              state={row.getValue("state")}
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
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <div className="text-sm-semibold cursor-pointer truncate text-center text-semantic-error-default">
                Delete
              </div>
            </Dialog.Trigger>
            <Dialog.Content>
              <GeneralDeleteResourceModal
                resource={row.original}
                handleDeleteResource={handleDeleteOperator}
                isDeleting={isDeleting}
              />
            </Dialog.Content>
          </Dialog.Root>
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
        primaryText="Operator"
        secondaryText="Add and organise your Operator"
      >
        <TableError marginBottom="!border-0" />
      </DataTable>
    );
  }

  if (sources.length === 0 && !isLoading) {
    return (
      <DataTable
        columns={columns}
        data={[]}
        pageSize={6}
        searchPlaceholder={null}
        searchKey={null}
        isLoading={isLoading}
        loadingRows={6}
        primaryText="Operator"
        secondaryText="Add and organise your Operator"
      >
        <SourceTablePlaceholder
          enableCreateButton={false}
          marginBottom="!border-0"
        />
      </DataTable>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={sources}
      pageSize={6}
      searchPlaceholder={"Search Operator"}
      searchKey={"id"}
      isLoading={isLoading}
      loadingRows={6}
      primaryText="Operator"
      secondaryText="Add and organise your Operator"
    />
  );
};
