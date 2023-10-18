import {
  Button,
  DataTable,
  getModelDefinitionToolkit,
} from "@instill-ai/design-system";
import { ColumnDef } from "@tanstack/react-table";
import { Model, ModelsWatchState } from "../../lib";
import {
  GeneralStateCell,
  GeneralTaskCell,
  SortIcon,
  TableError,
} from "../../components";
import { TableCell } from "../../components/cells/TableCell";
import { formatDate, parseStatusLabel } from "../../lib/table";
import { ModelTablePlaceholder } from "./ModelTablePlaceholder";

export type ModelsTableProps = {
  models: Model[];
  modelsWatchState: ModelsWatchState;
  isError: boolean;
  isLoading: boolean;
};

export const ModelsTable = (props: ModelsTableProps) => {
  const { models, modelsWatchState, isError, isLoading } = props;

  const columns: ColumnDef<Model>[] = [
    {
      accessorKey: "id",
      header: () => <div className="min-w-[300px] text-left">ID</div>,
      cell: ({ row }) => {
        const { getIcon } = getModelDefinitionToolkit(
          row.original.model_definition
        );

        const modelNameFragments = row.original.name.split("/");
        const modelLink = `/${modelNameFragments[1]}/model-hub/${modelNameFragments[3]}`;

        return (
          <div className="text-left">
            <TableCell
              primaryLink={modelLink}
              primaryText={row.getValue("id")}
              secondaryLink={null}
              secondaryText={row.original.model_definition}
              iconElement={getIcon({
                width: "w-4",
                height: "h-4",
                position: "my-auto",
                color: "fill-semantic-bg-secondary-base-bg",
              })}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "task",
      header: () => <div className="text-left">Task</div>,
      cell: ({ row }) => {
        return (
          <GeneralTaskCell modelTask={row.getValue("task")} className={null} />
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
        const name: string = row.original.name;
        return (
          <div className="grid justify-items-center">
            <GeneralStateCell
              width={null}
              state={
                modelsWatchState
                  ? modelsWatchState[name]
                    ? modelsWatchState[name].state
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
