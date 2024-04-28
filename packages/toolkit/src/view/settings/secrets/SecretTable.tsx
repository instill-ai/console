"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Secret, formatDate } from "../../../lib";
import { SortIcon, TableError } from "../../../components";
import { Button, DataTable } from "@instill-ai/design-system";
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
      header: () => <div className="min-w-[200px] text-left">id</div>,
      cell: ({ row }) => {
        return (
          <div className="flex flex-col">
            <p className="product-body-text-3-semibold">{row.original.id}</p>
            <p className="line-clamp-2 text-semantic-fg-disabled product-body-text-3-regular">
              {row.original.description}
            </p>
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
