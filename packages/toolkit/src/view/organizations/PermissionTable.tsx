import { ColumnDef } from "@tanstack/react-table";
import { DataTable, Icons } from "@instill-ai/design-system";
import { useUser, type Nullable, type Pipeline } from "../../lib";
import { TableError } from "../../components";
import { PermissionTablePlaceholder } from "./PermissionTablePlaceholder";
import { UsersCard } from "./UsersCard";

export type PermissionTableProps = {
  permissions: Pipeline[];
  isError: boolean;
  isLoading: boolean;
  accessToken: Nullable<string>;
  enableQuery: boolean;
};

export const PermissionTable = (props: PermissionTableProps) => {
  const { permissions, isError, isLoading, accessToken, enableQuery } = props;

  const user = useUser({
    accessToken,
    enabled: enableQuery,
  });

  const columns: ColumnDef<Pipeline>[] = [
    {
      accessorKey: "name",
      header: () => <div className="min-w-[650px] text-left">Name</div>,
      cell: ({ row }) => {
        return (
          <div className="flex flex-row gap-x-2 text-left">
            <p>Users</p>
            <Icons.Lock03 className="h-5 w-5 stroke-slate-500" />
          </div>
        );
      },
    },
    {
      accessorKey: "users",
      header: ({ column }) => {
        return <div className="text-center">User</div>;
      },

      cell: ({ row }) => {
        return (
          <div>
            <UsersCard members={[]} />
          </div>
        );
      },
    },
    {
      accessorKey: "pipelines",
      header: () => <div className="max-w-[100px] text-center">Pipelines</div>,
      cell: ({ row }) => {
        return (
          <div>
            <p className="text-semantic-fg-disabled product-body-text-3-regular">
              6 (ALL)
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "models",
      header: () => <div className="max-w-[100px] text-center">Models</div>,
      cell: ({ row }) => {
        return (
          <p className="text-semantic-fg-disabled product-body-text-3-regular">
            16 (ALL)
          </p>
        );
      },
    },
    {
      accessorKey: "group_admins",
      header: () => (
        <div className="max-w-[100px] text-center">Groups Admins</div>
      ),
      cell: ({ row }) => {
        return (
          <div className="text-center">
            <p className="text-semantic-accent-default !underline underline-offset-1 product-button-button-3">
              None
            </p>
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
        primaryText={null}
        secondaryText={null}
      >
        <TableError marginBottom="!border-0" />
      </DataTable>
    );
  }

  if (permissions.length === 0 && !isLoading) {
    return (
      <DataTable
        columns={columns}
        data={[]}
        pageSize={6}
        searchPlaceholder={null}
        searchKey={null}
        isLoading={isLoading}
        loadingRows={6}
        primaryText={null}
        secondaryText={null}
      >
        <PermissionTablePlaceholder
          enableCreateButton={false}
          marginBottom="!border-0"
        />
      </DataTable>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={permissions}
      pageSize={6}
      searchPlaceholder={null}
      searchKey={null}
      isLoading={isLoading || !user.isSuccess}
      loadingRows={6}
      primaryText={null}
      secondaryText={null}
    />
  );
};
