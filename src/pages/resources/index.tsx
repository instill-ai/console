import { FC, ReactElement, useState } from "react";
import { PageHead, Topbar, Sidebar, PageBase } from "@/components";
import {
  ConnectorResourceWithDefinition,
  GeneralDeleteResourceModal,
  ImageWithFallback,
  Model,
  Nullable,
  Pipeline,
  SortIcon,
  TableError,
  formatDate,
  getInstillApiErrorMessage,
  useDeleteUserConnectorResource,
  useUser,
  useUserConnectorResources,
} from "@instill-ai/toolkit";
import { ColumnDef } from "@tanstack/react-table";
import {
  Button,
  DataTable,
  Dialog,
  Icons,
  Logo,
  useToast,
} from "@instill-ai/design-system";
import { isAxiosError } from "axios";
import { AddConnectorResourceDialog } from "pipeline-builder/components";

type GetLayOutProps = {
  page: ReactElement;
};

const PipelinePage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const user = useUser({
    enabled: true,
    accessToken: null,
  });

  const { toast } = useToast();

  const [isDeleting, setIsDeleting] = useState(false);
  const [addConnectorDialogIsOpen, seteAddConnectorDialogIsOpen] =
    useState(false);

  const deleteUserConnectorResource = useDeleteUserConnectorResource();

  function handleDeleteUserConnectorResource(
    resource: Nullable<Pipeline | Model | ConnectorResourceWithDefinition>
  ) {
    if (!resource) {
      return;
    }

    setIsDeleting(true);

    deleteUserConnectorResource.mutate(
      {
        connectorResourceName: resource.name,
        accessToken: null,
      },
      {
        onSuccess: () => {
          setIsDeleting(false);
          toast({
            title: "Successfully delete resource",
            variant: "alert-success",
            size: "small",
          });
        },
        onError: (error) => {
          setIsDeleting(false);
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

  const userConnectorResources = useUserConnectorResources({
    userName: user.isSuccess ? user.data.name : null,
    enabled: user.isSuccess,
    accessToken: null,
    connectorResourceType: "all",
  });

  const columns: ColumnDef<ConnectorResourceWithDefinition>[] = [
    {
      accessorKey: "id",
      header: () => <div className="min-w-[650px] text-left">Pipelines</div>,
      cell: ({ row }) => {
        const definition = row.original.connector_definition;
        return (
          <div className="flex flex-row gap-x-3">
            <div className="my-auto flex h-8 w-8 items-center justify-center rounded-full bg-semantic-bg-secondary">
              <ImageWithFallback
                src={`/icons/${definition.vendor}/${definition.icon}`}
                width={16}
                height={16}
                alt={`${definition.title}-icon`}
                fallbackImg={
                  <Icons.Box className="h-8 w-8 stroke-semantic-fg-primary" />
                }
              />
            </div>
            <div className="group flex cursor-pointer flex-col">
              <p className="text-semantic-fg-primary product-body-text-3-semibold group-hover:!underline">
                {row.getValue("id")}
              </p>
              <p className="text-[#475467] product-body-text-3-regular">
                {definition.id}
              </p>
            </div>
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
              <Dialog.Content>
                <GeneralDeleteResourceModal
                  resource={row.original}
                  handleDeleteResource={handleDeleteUserConnectorResource}
                  isDeleting={isDeleting}
                />
              </Dialog.Content>
            </Dialog.Root>
          </div>
        );
      },
    },
  ];

  if (userConnectorResources.isError) {
    return (
      <DataTable
        columns={columns}
        data={[]}
        pageSize={6}
        searchPlaceholder={null}
        searchKey={null}
        isLoading={userConnectorResources.isLoading}
        loadingRows={6}
        primaryText="Resources"
        secondaryText="Check your resources"
      >
        <TableError marginBottom="!border-0" />
      </DataTable>
    );
  }

  if (
    userConnectorResources.isSuccess &&
    userConnectorResources.data.length === 0
  ) {
    return (
      <DataTable
        columns={columns}
        data={[]}
        pageSize={6}
        searchPlaceholder={null}
        searchKey={null}
        isLoading={userConnectorResources.isLoading}
        loadingRows={6}
        primaryText="Resources"
        secondaryText="Check your resources"
      >
        <div className="flex min-h-[300px] w-full flex-row items-center justify-center border border-semantic-bg-line bg-semantic-bg-primary px-[9px] py-[18px]">
          <h3 className="text-semantic-fg-primary product-headings-heading-3">
            Set up your first resource
          </h3>
        </div>
      </DataTable>
    );
  }

  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/

  return (
    <>
      <PageHead title="pipelines" />
      <div className="flex flex-col">
        <div className="mb-8 flex">
          <AddConnectorResourceDialog
            open={addConnectorDialogIsOpen}
            onOpenChange={(open) => seteAddConnectorDialogIsOpen(open)}
            accessToken={null}
            type="inResource"
            onSelectConnectorResource={() => {
              seteAddConnectorDialogIsOpen(false);
            }}
          />
        </div>
        <DataTable
          columns={columns}
          data={
            userConnectorResources.isSuccess ? userConnectorResources.data : []
          }
          pageSize={6}
          searchPlaceholder={"Search Resource"}
          searchKey={"id"}
          isLoading={userConnectorResources.isLoading}
          loadingRows={6}
          primaryText="Resource"
          secondaryText="Check your resource"
        />
      </div>
    </>
  );
};

PipelinePage.getLayout = (page) => {
  return (
    <PageBase>
      <Topbar logo={<Logo variant="ColourLogomarkWhiteType" width={180} />} />
      <PageBase.Container>
        <Sidebar />
        <PageBase.Content contentPadding="p-8">{page}</PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};

export default PipelinePage;
