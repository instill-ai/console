"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button, DataTable } from "@instill-ai/design-system";

import { formatDate, type Pipeline } from "../../lib";
import { SortIcon, TableError } from "../../components";
import { PipelineTablePlaceholder } from "./PipelineTablePlaceholder";
import { useRouter } from "next/navigation";

export type PipelinesTableProps = {
  pipelines: Pipeline[];
  isError: boolean;
  isLoading: boolean;
};

export const PipelinesTable = (props: PipelinesTableProps) => {
  const { pipelines, isError, isLoading } = props;
  const router = useRouter();

  const columns: ColumnDef<Pipeline>[] = [
    {
      accessorKey: "id",
      header: () => <div className="min-w-[650px] text-left">Pipelines</div>,
      cell: ({ row }) => {
        const pipelineNameFragments = row.original.name.split("/");

        return (
          <div className="text-left">
            <button
              onClick={() => {
                router.push(
                  `/${pipelineNameFragments[1]}/pipelines/${pipelineNameFragments[3]}`
                );
              }}
            >
              <h3 className="cursor-pointer text-semantic-fg-primary product-body-text-3-semibold">
                {row.getValue("id")}
              </h3>
            </button>
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
  );
};
