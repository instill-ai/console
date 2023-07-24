import {
  ConnectionTypeCell,
  ConnectorWithPipelines,
  ConnectorsWatchState,
  NameCell,
  Nullable,
  PaginationListContainer,
  PaginationListContainerProps,
  PipelinesCell,
  SkeletonCell,
  StateOverview,
  TableHead,
  TableHeadItem,
  VisibilityCell,
  chunk,
  env,
  useSearchedResources,
  useStateOverviewCounts,
} from "@instill-ai/toolkit";
import * as React from "react";
import { AITablePlaceholder } from "./table/AITablePlaceholder";
import { ColumnDef } from "@tanstack/react-table";
import { Button, DataTable } from "@instill-ai/design-system";
import { getIcon } from "./DashboardPipelinesTable";
import { TableError } from "./table/TableError";

export type AIsTableProps = {
  ais: ConnectorWithPipelines[];
  aisWatchState: ConnectorsWatchState;
  isError: boolean;
  isLoading: boolean;
} & Pick<PaginationListContainerProps, "marginBottom">;

export const AIsTable = (props: AIsTableProps) => {
  const { ais, aisWatchState, marginBottom, isError, isLoading } = props;

  const [searchTerm, setSearchTerm] = React.useState<Nullable<string>>(null);

  // We will only use searched resource when user input search term

  const searchedAIs = useSearchedResources({
    resources: ais,
    searchTerm,
  });

  const aiPages = React.useMemo(() => {
    if (!searchTerm) {
      return chunk(ais, env("NEXT_PUBLIC_LIST_PAGE_SIZE"));
    }
    return chunk(searchedAIs, env("NEXT_PUBLIC_LIST_PAGE_SIZE"));
  }, [searchedAIs, ais, searchTerm]);

  const stateOverviewCounts = useStateOverviewCounts(
    searchTerm ? searchedAIs : ais,
    aisWatchState,
    isLoading
  );

  const columns: ColumnDef<ConnectorWithPipelines>[] = [
    {
      accessorKey: "id",
      header: () => <div className="text-left">Model Name</div>,
      cell: ({ row }) => {
        return <div className="text-left">{row.getValue("id")}</div>;
      },
    },
    {
      accessorKey: "task",
      header: () => <div className="max-w-[100px] text-center">Task</div>,
      cell: ({ row }) => {
        return <div className="text-center">{row.getValue("task")}</div>;
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
            {row.getValue("create_time")}
          </div>
        );
      },
    },
    {
      accessorKey: "state",
      header: () => <div className="text-center">Status</div>,
      cell: ({ row }) => {
        return (
          <div className="truncate text-center text-semantic-fg-secondary product-body-text-3-regular">
            {row.getValue("state")}
          </div>
        );
      },
    },
    {
      accessorKey: "uid",
      header: () => <div className="text-center"></div>,
      cell: ({ row }) => {
        return (
          <div className="truncate text-center text-semantic-fg-secondary product-body-text-3-regular">
            {row.getValue("uid")}
          </div>
        );
      },
    },
  ];

  if (isError) {
    return (
      <DataTable
        columns={columns}
        data={ais}
        pageSize={6}
        searchPlaceholder={null}
        searchKey={null}
        isLoading={isLoading}
        loadingRows={6}
      >
        <TableError />
      </DataTable>
    );
  }

  if (ais.length === 0 && !isLoading) {
    return (
      <DataTable
        columns={columns}
        data={ais}
        pageSize={6}
        searchPlaceholder={null}
        searchKey={null}
        isLoading={isLoading}
        loadingRows={6}
      >
        <AITablePlaceholder enableCreateButton={false} />
      </DataTable>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={ais}
      pageSize={6}
      searchPlaceholder={null}
      searchKey={null}
      isLoading={isLoading}
      loadingRows={6}
    />
  );
};
