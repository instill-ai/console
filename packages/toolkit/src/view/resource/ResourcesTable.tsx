import * as React from "react";
import {
  Button,
  DataTable,
  Dialog,
  Icons,
  useToast,
} from "@instill-ai/design-system";

import { ColumnDef } from "@tanstack/react-table";
import {
  ConnectorWithDefinition,
  Nullable,
  formatDate,
  toastInstillError,
  useDeleteUserConnector,
} from "../../lib";
import {
  GenerateDeleteResourceDialog,
  ImageWithFallback,
  SortIcon,
  TableCell,
  TableError,
} from "../../components";

export type ResourcesTableProps = {
  connectors: ConnectorWithDefinition[];
  isError: boolean;
  isLoading: boolean;
  accessToken: Nullable<string>;
};

export const ResourcesTable = (props: ResourcesTableProps) => {
  const { connectors, isError, isLoading, accessToken } = props;
  const [deleteConnectorDialogOpen, setDeleteConnectorDialogOpen] =
    React.useState(false);
  const { toast } = useToast();

  const deleteUserConnector = useDeleteUserConnector();

  async function handleDeleteUserConnector(connector: ConnectorWithDefinition) {
    try {
      await deleteUserConnector.mutateAsync({
        connectorName: connector.name,
        accessToken,
      });

      toast({
        title: "Successfully delete connector",
        variant: "alert-success",
        size: "small",
      });
    } catch (error) {
      toastInstillError({
        title: "Something went wrong when delete the connector",
        error,
        toast,
      });
    }
  }

  const columns: ColumnDef<ConnectorWithDefinition>[] = [
    {
      accessorKey: "id",
      header: () => <div className="min-w-[650px] text-left">Pipelines</div>,
      cell: ({ row }) => {
        const definition = row.original.connector_definition;
        const resourceNameFragments = row.original.name.split("/");
        const resourceLink = `/${resourceNameFragments[1]}/connectors/${resourceNameFragments[3]}`;
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
                    <Icons.Box className="h-4 w-4 stroke-semantic-fg-primary" />
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
        return accessToken ? (
          <div className="flex justify-center">
            <GenerateDeleteResourceDialog
              open={deleteConnectorDialogOpen}
              onOpenChange={(open) => setDeleteConnectorDialogOpen(open)}
              resourceID={row.original.id}
              title={`Delete ${row.original.id}`}
              description="This action cannot be undone. This will permanently delete the connector."
              handleDeleteResource={() =>
                handleDeleteUserConnector(row.original)
              }
              trigger={
                <Button variant="tertiaryDanger" size="lg">
                  Delete
                </Button>
              }
            />
          </div>
        ) : null;
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
        primaryText="Connectors"
        secondaryText="Check your connectors"
      >
        <TableError marginBottom="!border-0" />
      </DataTable>
    );
  }

  if (connectors.length === 0 && !isLoading) {
    return (
      <DataTable
        columns={columns}
        data={[]}
        pageSize={6}
        searchPlaceholder={null}
        searchKey={null}
        isLoading={isLoading}
        loadingRows={6}
        primaryText="Connectors"
        secondaryText="Check your connectors"
      >
        <div className="flex min-h-[300px] w-full flex-row items-center justify-center bg-semantic-bg-primary px-[9px] py-[18px]">
          <h3 className="text-semantic-fg-primary product-headings-heading-3">
            Set up your first connectors
          </h3>
        </div>
      </DataTable>
    );
  }

  return (
    <React.Fragment>
      <DataTable
        columns={columns}
        data={connectors}
        pageSize={6}
        searchPlaceholder={"Search Connectors"}
        searchKey={"id"}
        isLoading={isLoading}
        loadingRows={6}
        primaryText="Connectors"
        secondaryText="Check your connectors"
      />
    </React.Fragment>
  );
};
