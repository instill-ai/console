import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button, DataTable, Dialog, Icons } from "@instill-ai/design-system";
import {
  PaginationListContainerProps,
  Pipeline,
  PipelineTablePlaceholder,
  PipelinesWatchState,
  SortIcon,
  TableError,
  TableCell,
  formatDate,
} from "@instill-ai/toolkit";
import { DeleteResourceModal } from "./DeleteResourceModal";

export type PipelinesTableProps = {
  pipelines: Pipeline[];
  pipelinesWatchState: PipelinesWatchState;
  isError: boolean;
  isLoading: boolean;
} & Pick<PaginationListContainerProps, "marginBottom">;

export const PipelinesTable = (props: PipelinesTableProps) => {
  const { pipelines, pipelinesWatchState, marginBottom, isError, isLoading } =
    props;

  const [deleteTokenDialogIsOpen, setDeleteTokenDialogIsOpen] =
    React.useState(false);
  const [selectedToken, setSelectedToken] = React.useState(null);

  const columns: ColumnDef<Pipeline>[] = [
    {
      accessorKey: "id",
      header: () => <div className="min-w-[300px] text-left">Pipelines</div>,
      cell: ({ row }) => {
        return (
          <div className="text-left">
            <TableCell
              primaryLink={`/pipelines/${row.getValue("id")}`}
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
      header: () => <div className="min-w-[100px] text-center"></div>,
      cell: ({ row }) => {
        return (
          <>
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <div className="text-sm-semibold cursor-pointer truncate text-center text-semantic-error-default">
                  <Icons.Trash01 className="h-5 w-5 stroke-semantic-error-default" />
                </div>
              </Dialog.Trigger>
              <Dialog.Content>
                <DeleteResourceModal
                  tokenNameToDelete={row.getValue("uid")}
                  onSuccess={() => {
                    setDeleteTokenDialogIsOpen(false);
                    setSelectedToken(null);
                  }}
                />
              </Dialog.Content>
            </Dialog.Root>
          </>
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
        secondaryText="Check your pipelines"
      >
        <TableError marginBottom="!border-0" />
      </DataTable>
    );
  }

  if (pipelines.length === 0 && !isLoading) {
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
        secondaryText="Check your pipelines"
      >
        <PipelineTablePlaceholder
          enableCreateButton={false}
          marginBottom="!border-0"
        />
      </DataTable>
    );
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={pipelines}
        pageSize={6}
        searchPlaceholder={"Search Pipelines"}
        searchKey={"id"}
        isLoading={isLoading}
        loadingRows={6}
        primaryText="Pipelines"
        secondaryText="Check your pipelines"
      />
    </>
  );
};
