import { ColumnDef } from "@tanstack/react-table";
import {
  ApiToken,
  Nullable,
  formatDate,
  parseTriggerStatusLabel,
} from "../../../lib";
import { GeneralStateCell, SortIcon, TableError } from "../../../components";
import { DeleteAPITokenDialog } from "./DeleteAPITokenDialog";
import { Button, DataTable } from "@instill-ai/design-system";
import { APITokenNameCell } from "./APITokenNameCell";

export type APITokenTableProps = {
  accessToken: Nullable<string>;
  isError: boolean;
  isLoading: boolean;
  tokens: ApiToken[];
};

export const APITokenTable = (props: APITokenTableProps) => {
  const { accessToken, isError, isLoading, tokens } = props;
  const columns: ColumnDef<ApiToken>[] = [
    {
      accessorKey: "state",
      header: () => <div className="min-w-[180px] text-left">Status</div>,
      cell: ({ row }) => {
        return (
          <div className="text-left">
            <GeneralStateCell
              width={null}
              state={row.getValue("state")}
              padding="py-2"
              label={parseTriggerStatusLabel(row.getValue("state"))}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "id",
      header: () => <div className="min-w-[300px] text-left">Tokens</div>,
      cell: ({ row }) => {
        return (
          <div className="text-left">
            <APITokenNameCell
              id={row.getValue("id")}
              accessToken={row.original.access_token}
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
      header: () => <div className="max-w-[100px] text-center"></div>,
      cell: ({ row }) => {
        return (
          <div className="flex justify-center">
            <DeleteAPITokenDialog
              deleteTokenName={row.original.name}
              accessToken={accessToken}
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
