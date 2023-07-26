import * as React from "react";

import {
  Button,
  DataTable,
  getModelDefinitionToolkit,
  getModelInstanceTaskToolkit,
} from "@instill-ai/design-system";
import { useRouter } from "next/router";
import {
  Model,
  ModelTablePlaceholder,
  ModelsWatchState,
  PaginationListContainerProps,
  TableError,
} from "@instill-ai/toolkit";
import { ColumnDef } from "@tanstack/react-table";
import { TableCell } from "./table/TableCell";
import { getIcon } from "./DashboardPipelinesTable";
import { formatDate, parseStatusLabel } from "@/lib/table";
import { GeneralStateCell } from "./cell/GeneralStateCell";

export type ModelsTableProps = {
  models: Model[];
  modelsWatchState: ModelsWatchState;
  isError: boolean;
  isLoading: boolean;
} & Pick<PaginationListContainerProps, "marginBottom">;

export const ModelsTable = (props: ModelsTableProps) => {
  const router = useRouter();
  const { models, modelsWatchState, marginBottom, isError, isLoading } = props;

  const columns: ColumnDef<Model>[] = [
    {
      accessorKey: "id",
      header: () => <div className="min-w-[300px] text-left">Model Name</div>,
      cell: ({ row }) => {
        const { getIcon } = getModelDefinitionToolkit(
          row.original.model_definition
        );
        return (
          <div className="text-left">
            <TableCell
              primaryLink={`/model-hub/${row.getValue("id")}`}
              primaryText={row.getValue("id")}
              secondaryLink={null}
              secondaryText={row.original.model_definition}
              iconElement={getIcon({
                width: "w-4",
                height: "h-4",
                position: "my-auto",
                color: "fill-instillGrey90",
              })}
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
      accessorKey: "task",
      header: () => <div className="text-center">Task</div>,
      cell: ({ row }) => {
        const { label, getIcon } = getModelInstanceTaskToolkit(
          row.getValue("task")
        );
        return (
          <div className={"flex flex-row justify-center gap-x-2 py-2 pr-6"}>
            {getIcon({
              width: "w-4",
              height: "h-4",
              position: "my-auto",
              color: "fill-instillGrey90",
            })}
            <p className="my-auto text-semantic-fg-secondary product-body-text-3-regular">
              {label}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "uid",
      header: () => <div className="text-center">Plan</div>,
      cell: ({ row }) => {
        return (
          <div className="text-semantic-fg-secondary product-body-text-3-regular">
            Basic
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
      >
        <TableError marginBottom="!border-0" />
      </DataTable>
    );
  }

  if (models.length === 0 && !isLoading) {
    return (
      <DataTable
        columns={columns}
        data={[]}
        pageSize={6}
        searchPlaceholder={null}
        searchKey={null}
        isLoading={isLoading}
        loadingRows={6}
      >
        <ModelTablePlaceholder
          enableCreateButton={false}
          marginBottom="!border-0"
        />
      </DataTable>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={models}
      pageSize={6}
      searchPlaceholder={null}
      searchKey={null}
      isLoading={isLoading}
      loadingRows={6}
    />
  );
};
