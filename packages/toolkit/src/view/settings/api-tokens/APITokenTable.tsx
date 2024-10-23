"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { ApiToken } from "instill-sdk";

import { Button, DataTable } from "@instill-ai/design-system";

import { GeneralStateCell, SortIcon, TableError } from "../../../components";
import { formatDate, parseTriggerStatusLabel } from "../../../lib";
import { APITokenNameCell } from "./APITokenNameCell";
import { DeleteAPITokenDialog } from "./DeleteAPITokenDialog";

export type APITokenTableProps = {
  isError: boolean;
  isLoading: boolean;
  tokens: ApiToken[];
};

export const APITokenTable = (props: APITokenTableProps) => {
  const { isError, isLoading, tokens } = props;
  const columns: ColumnDef<ApiToken>[] = [
    {
      accessorKey: "state",
      header: () => <div className="min-w-[100px] text-left">Status</div>,
      cell: ({ row }) => {
        return (
          <div className="text-left">
            <GeneralStateCell
              width={null}
              state={row.getValue("state")}
              padding="py-0"
              label={parseTriggerStatusLabel(row.getValue("state"))}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "id",
      header: () => <div className="min-w-[200px] text-left">Tokens</div>,
      cell: ({ row }) => {
        return (
          <div className="text-left">
            <APITokenNameCell
              id={row.getValue("id")}
              accessToken={row.original.accessToken}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "createTime",
      header: ({ column }) => {
        return (
          <div className="flex">
            <Button
              className="gap-x-2 p-0"
              variant="tertiaryGrey"
              size="sm"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              <span className="text-left">Date added</span>
              <SortIcon type={column.getIsSorted()} />
            </Button>
          </div>
        );
      },

      cell: ({ row }) => {
        return (
          <div className="truncate text-left text-semantic-fg-secondary product-body-text-3-regular">
            {formatDate(row.getValue("createTime"))}
          </div>
        );
      },
    },
    {
      accessorKey: "lastUseTime",
      header: ({ column }) => {
        return (
          <div className="flex">
            <Button
              className="gap-x-2 p-0"
              variant="tertiaryGrey"
              size="sm"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              <span className="text-left">Last Used</span>
              <SortIcon type={column.getIsSorted()} />
            </Button>
          </div>
        );
      },

      cell: ({ row }) => {
        return (
          <div className="truncate text-left text-semantic-fg-secondary product-body-text-3-regular">
            {row.getValue("lastUseTime")
              ? formatDate(row.getValue("lastUseTime"))
              : "Never used"}
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
            <DeleteAPITokenDialog tokenName={row.original.name} />
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
        primaryText="Tokens"
        secondaryText="Check your tokens"
      >
        <TableError marginBottom="!border-0" />
      </DataTable>
    );
  }

  if (tokens.length === 0 && !isLoading) {
    return (
      <DataTable
        columns={columns}
        data={[]}
        pageSize={6}
        searchPlaceholder={null}
        searchKey={null}
        isLoading={isLoading}
        loadingRows={6}
        primaryText="Tokens"
        secondaryText="Check your tokens"
      >
        <div className="flex min-h-[300px] items-center justify-center">
          <p className="text-semantic-fg-primary product-body-text-3-regular">
            Create your API token
          </p>
        </div>
      </DataTable>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={tokens}
      pageSize={6}
      searchPlaceholder={"Search Tokens"}
      searchKey={"id"}
      isLoading={isLoading}
      loadingRows={6}
      primaryText="Tokens"
      secondaryText="Check your tokens"
    />
  );
};
