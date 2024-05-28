"use client";

import {
  Button,
  DataTable,
  getModelInstanceTaskToolkit,
} from "@instill-ai/design-system";
import { ColumnDef } from "@tanstack/react-table";
import { Model } from "../../lib";
import { SortIcon, TableError } from "../../components";
import { TableCell } from "../../components/cells/TableCell";
import { formatDate } from "../../lib/table";
import { ModelTablePlaceholder } from "./ModelTablePlaceholder";

export type ModelsTableProps = {
  models: Model[];
  isError: boolean;
  isLoading: boolean;
};

/* const modelsWatchState = useWatchUserModels({
  modelNames: models.isSuccess ? models.data.map((p) => p.name) : [],
  enabled: enableQuery && models.isSuccess && models.data.length > 0,
  accessToken,
}); */

export const ModelsTable = (props: ModelsTableProps) => {
  const { models, isError, isLoading } = props;

  const columns: ColumnDef<Model>[] = [
    {
      accessorKey: "id",
      header: () => <div className="min-w-[650px] text-left">ID</div>,
      cell: ({ row }) => {
        const { getIcon, label } = getModelInstanceTaskToolkit(
          row.original.task
        );

        const modelNameFragments = row.original.name.split("/");
        const modelLink = `/${modelNameFragments[1]}/models/${modelNameFragments[3]}/overview`;

        return (
          <div className="text-left">
            <TableCell
              primaryLink={modelLink}
              primaryText={row.getValue("id")}
              secondaryLink={null}
              secondaryText={label}
              iconElement={getIcon(
                `w-4 h-4 ${["TASK_TEXT_GENERATION_CHAT", "TASK_IMAGE_TO_IMAGE", "TASK_VISUAL_QUESTION_ANSWERING"].includes(row.original.task || "") ? "stroke-semantic-fg-primary [&>*]:!stroke-semantic-fg-primary" : "[&>*]:!fill-semantic-fg-primary"}`
              )}
            />
          </div>
        );
      },
    },
    /* TODO: put this back later using the updated endpoint
    
    {
      accessorKey: "state",
      header: () => <div className="text-center">Status</div>,
      cell: ({ row }) => {
        const name: string = row.original.name;
        return (
          <div className="grid justify-items-center">
            <GeneralStateCell
              width={null}
              state={'STATE_ACTIVE'}
              padding="py-2"
              label={parseStatusLabel('STATE_ACTIVE')}
            />
          </div>
        );
      },
    }, */
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
        primaryText="Models"
        secondaryText="Check and organise your imported Models"
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
        primaryText="Models"
        secondaryText="Check and organise your imported Models"
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
      searchPlaceholder={"Search Models"}
      searchKey={"id"}
      isLoading={isLoading}
      loadingRows={6}
      primaryText="Models"
      secondaryText="Check and organise your imported Models"
    />
  );
};
