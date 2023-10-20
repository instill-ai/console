import {
  Button,
  DataTable,
  Dialog,
  Icons,
  useToast,
} from "@instill-ai/design-system";

import { ColumnDef } from "@tanstack/react-table";
import { isAxiosError } from "axios";
import * as React from "react";
import {
  ConnectorResourceWithDefinition,
  Model,
  Nullable,
  Pipeline,
  formatDate,
  getInstillApiErrorMessage,
  useDeleteUserConnectorResource,
} from "../../lib";
import {
  GeneralDeleteResourceModal,
  ImageWithFallback,
  SortIcon,
  TableCell,
  TableError,
} from "../../components";

export type ResourcesTableProps = {
  connectorResources: ConnectorResourceWithDefinition[];
  isError: boolean;
  isLoading: boolean;
  accessToken: Nullable<string>;
};

export const ResourcesTable = (props: ResourcesTableProps) => {
  const { connectorResources, isError, isLoading, accessToken } = props;
  const { toast } = useToast();

  const deleteUserConnectorResource = useDeleteUserConnectorResource();

  function handleDeleteUserConnectorResource(
    resource: Nullable<Pipeline | Model | ConnectorResourceWithDefinition>
  ) {
    if (!resource) {
      return;
    }

    deleteUserConnectorResource.mutate(
      {
        connectorResourceName: resource.name,
        accessToken,
      },
      {
        onSuccess: () => {
          toast({
            title: "Successfully delete resource",
            variant: "alert-success",
            size: "small",
          });
        },
        onError: (error) => {
          if (isAxiosError(error)) {
            toast({
              title: "Something went wrong when delete the resource",
              description: getInstillApiErrorMessage(error),
              variant: "alert-error",
              size: "large",
            });
          } else {
            toast({
              title: "Something went wrong when delete the resource",
              description: "Please try again later",
              variant: "alert-error",
              size: "large",
            });
          }
        },
      }
    );
  }

  const columns: ColumnDef<ConnectorResourceWithDefinition>[] = [
    {
      accessorKey: "id",
      header: () => <div className="min-w-[650px] text-left">Pipelines</div>,
      cell: ({ row }) => {
        const definition = row.original.connector_definition;
        const resourceNameFragments = row.original.name.split("/");
        const resourceLink = `/${resourceNameFragments[1]}/resources/${resourceNameFragments[3]}`;
        return (
          <div className="text-left">
            <TableCell
              primaryLink={resourceLink}
              primaryText={row.getValue("id")}
              secondaryText={definition.id}
              secondaryLink={null}
              iconElement={
                <ImageWithFallback
                  src={`/icons/${definition.vendor}/${definition.icon}`}
                  width={16}
                  height={16}
                  alt={`${definition.title}-icon`}
                  fallbackImg={
                    <Icons.Box className="h-8 w-8 stroke-semantic-fg-primary" />
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
      accessorKey: "uid",
      header: () => <div className="max-w-[100px] text-center"></div>,
      cell: ({ row }) => {
        return (
          <div className="flex justify-center">
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <div className="text-sm-semibold cursor-pointer truncate text-center text-semantic-error-default">
                  Delete
                </div>
              </Dialog.Trigger>
              <Dialog.Content className="!w-[512px]">
                <GeneralDeleteResourceModal
                  resource={row.original}
                  handleDeleteResource={handleDeleteUserConnectorResource}
                />
              </Dialog.Content>
            </Dialog.Root>
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
        primaryText="Resources"
        secondaryText="Check your resources"
      >
        <TableError marginBottom="!border-0" />
      </DataTable>
    );
  }

  if (connectorResources.length === 0 && !isLoading) {
    return (
      <DataTable
        columns={columns}
        data={[]}
        pageSize={6}
        searchPlaceholder={null}
        searchKey={null}
        isLoading={isLoading}
        loadingRows={6}
        primaryText="Resources"
        secondaryText="Check your resources"
      >
        <div className="flex min-h-[300px] w-full flex-row items-center justify-center bg-semantic-bg-primary px-[9px] py-[18px]">
          <h3 className="text-semantic-fg-primary product-headings-heading-3">
            Set up your first resource
          </h3>
        </div>
      </DataTable>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={connectorResources}
      pageSize={6}
      searchPlaceholder={"Search Resource"}
      searchKey={"id"}
      isLoading={isLoading}
      loadingRows={6}
      primaryText="Resource"
      secondaryText="Check your resource"
    />
  );
};
