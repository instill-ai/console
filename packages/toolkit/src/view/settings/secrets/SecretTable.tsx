"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Button, DataTable } from "@instill-ai/design-system";

import { SortIcon, TableError } from "../../../components";
import { formatDate, Secret } from "../../../lib";
import { DeleteSecretDialog } from "./DeleteSecretDialog";

export type APITokenTableProps = {
  isError: boolean;
  isLoading: boolean;
  secrets: Secret[];
};

export const SecretTable = (props: APITokenTableProps) => {
  const { isError, isLoading, secrets } = props;
  const columns: ColumnDef<Secret>[] = [
    {
      accessorKey: "id",
      header: () => <div className="min-w-[200px] text-left">Name</div>,
      cell: ({ row }) => {
        return (
          <div className="flex flex-col w-full">
            <p className="product-body-text-3-semibold">{row.original.id}</p>
            <p className="line-clamp-2 text-semantic-fg-disabled product-body-text-3-regular overflow-hidden truncate">
              {row.original.description}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "createTime",
      header: ({ column }) => {
        return (
          <div className="text-left">
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
      accessorKey: "uid",
      header: () => <div className="max-w-[100px] text-center"></div>,
      cell: ({ row }) => {
        return (
          <div className="flex justify-center">
            <DeleteSecretDialog secretName={row.original.name} />
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
        primaryText="Secrets"
        secondaryText="Check your secrets"
      >
        <TableError marginBottom="!border-0" />
      </DataTable>
    );
  }

  if (secrets.length === 0 && !isLoading) {
    return (
      <DataTable
        columns={columns}
        data={[]}
        pageSize={6}
        searchPlaceholder={null}
        searchKey={null}
        isLoading={isLoading}
        loadingRows={6}
        primaryText="Secrets"
        secondaryText="Check your secrets"
      >
        <div className="flex min-h-[300px] items-center justify-center">
          <p className="text-semantic-fg-primary product-body-text-3-regular">
            Create your secret
          </p>
        </div>
      </DataTable>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={secrets}
      pageSize={6}
      searchPlaceholder={"Search Secrets"}
      searchKey={"id"}
      isLoading={isLoading}
      loadingRows={6}
      primaryText="Secrets"
      secondaryText="Check your secrets"
    />
  );
};
