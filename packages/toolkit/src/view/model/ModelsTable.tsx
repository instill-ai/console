"use client";

import type { Model } from "instill-sdk";
import { ColumnDef } from "@tanstack/react-table";

import {
  Button,
  cn,
  DataTable,
  getModelInstanceTaskToolkit,
} from "@instill-ai/design-system";

import { ModelStateLabel, SortIcon, TableError } from "../../components";
import { TableCell } from "../../components/cells/TableCell";
import {
  InstillStore,
  useInstillStore,
  useRouteInfo,
  useShallow,
  useWatchNamespaceModels,
} from "../../lib";
import { formatDate } from "../../lib/table";
import { ModelTablePlaceholder } from "./ModelTablePlaceholder";

export type ModelsTableProps = {
  models: Model[];
  isError: boolean;
  isLoading: boolean;
};

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enableQuery: store.enabledQuery,
});

export const ModelsTable = (props: ModelsTableProps) => {
  const routeInfo = useRouteInfo();
  const { accessToken, enableQuery } = useInstillStore(useShallow(selector));
  const { models, isError, isLoading } = props;

  const modelsWatchState = useWatchNamespaceModels({
    modelIds: models.length > 0 ? models.map((model) => model.id) : [],
    namespaceId: routeInfo.isSuccess ? routeInfo.data.namespaceId : null,
    enabled: enableQuery && routeInfo.isSuccess && models.length > 0,
    accessToken,
  });

  const columns: ColumnDef<Model>[] = [
    {
      accessorKey: "id",
      header: () => <div className="min-w-[500px] text-left">ID</div>,
      cell: ({ row }) => {
        const { getIcon, label } = getModelInstanceTaskToolkit(
          row.original.task,
        );

        const modelNameFragments = row.original.name.split("/");
        const modelLink = `/${modelNameFragments[1]}/models/${modelNameFragments[3]}/playground`;

        return (
          <div className="text-left">
            <TableCell
              primaryLink={modelLink}
              primaryText={row.getValue("id")}
              secondaryLink={null}
              secondaryText={label}
              iconElement={getIcon(
                cn(
                  "w-4 h-4",
                  ["TASK_CHAT", "TASK_CUSTOM"].includes(row.original.task || "")
                    ? "stroke-semantic-fg-primary [&>*]:!stroke-semantic-fg-primary"
                    : "[&>*]:!fill-semantic-fg-primary",
                ),
              )}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "state",
      header: () => <div className="min-w-[100px] text-center">Status</div>,
      cell: ({ row }) => {
        const id = row.original.id;

        return (
          <div className="grid justify-items-center">
            <ModelStateLabel state={modelsWatchState.data?.[id]?.state} />
          </div>
        );
      },
    },
    {
      accessorKey: "createTime",
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
            {formatDate(row.getValue("createTime"))}
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
