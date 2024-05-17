import { ColumnDef, PaginationState } from "@tanstack/react-table";
import {
  InstillStore,
  Model,
  useInstillStore,
  useInfiniteModelVersions,
  useShallow,
  ModelVersion,
} from "../../../lib";
import { DataTable } from "@instill-ai/design-system";
import { getHumanReadableStringFromTime } from "../../../server";
import { StateLabel } from "../../../components";
import { useEffect, useMemo, useState } from "react";

export type ModelSettingsVersionsProps = {
  model: Model;
};

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const ModelSettingsVersions = ({
  model,
}: ModelSettingsVersionsProps) => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));
  const columns: ColumnDef<ModelVersion>[] = [
    {
      accessorKey: "id",
      header: () => <div className="text-left">ID</div>,
      cell: ({ row }) => {
        return (
          <div className="font-normal text-semantic-bg-secondary-secondary">
            {row.getValue("id")}
          </div>
        );
      },
    },
    {
      accessorKey: "digest",
      header: () => <div className="text-left">Version</div>,
      cell: ({ row }) => {
        return (
          <div className="truncate font-normal text-semantic-bg-secondary-alt-primary">
            {row.getValue("digest")}
          </div>
        );
      },
    },
    {
      accessorKey: "state",
      header: () => <div className="text-left">Status</div>,
      cell: ({ row }) => {
        return (
          <div className="flex flex-row justify-start">
            {
              <StateLabel
                className="rounded-full px-2 py-0.5"
                state={row.getValue("state")}
                enableBgColor
                enableIcon={false}
                iconHeight="h-3"
                iconWidth="w-3"
                iconPosition="my-auto"
              />
            }
          </div>
        );
      },
    },
    {
      accessorKey: "update_time",
      header: () => <div className="text-left">Updated at</div>,
      cell: ({ row }) => {
        return (
          <div className="font-normal text-semantic-bg-secondary-alt-primary">
            {getHumanReadableStringFromTime(
              row.getValue("update_time"),
              Date.now()
            )}
          </div>
        );
      },
    },
  ];

  const versions = useInfiniteModelVersions({
    accessToken,
    enabledQuery,
    modelName: model.name,
  });

  useEffect(() => {
    if (!versions.data?.pages[pagination.pageIndex]) {
      versions.fetchNextPage();
    }
  }, [pagination.pageIndex, versions]);

  const pageCount = useMemo(() => {
    if (versions.data?.pages[0]) {
      return Math.ceil(
        versions.data.pages[0].total_size / versions.data.pages[0].page_size
      );
    }

    return 1;
  }, [versions.data]);

  const versionList = useMemo(() => {
    return versions.data?.pages.reduce(
      (acc: ModelVersion[], page) => [...acc, ...page.versions],
      []
    );
  }, [versions.data]);

  const currentPageData = useMemo(() => {
    if (!versionList) {
      return [];
    }

    const offset = pagination.pageIndex * pagination.pageSize;

    return versionList.slice(offset, offset + pagination.pageSize);
  }, [versionList, pagination]);

  const onPaginationChange = (state: PaginationState) => {
    setPagination(state);
  };

  return (
    <DataTable
      columns={columns as ColumnDef<unknown>[]} // https://github.com/TanStack/table/issues/4382#issuecomment-2081153305
      data={currentPageData}
      pageSize={pagination.pageSize}
      isLoading={
        versions.isLoading || versions.isFetching || versions.isFetchingNextPage
      }
      loadingRows={pagination.pageSize}
      manualPagination={true}
      pageCount={pageCount}
      onPaginationChange={onPaginationChange}
      showPageNumbers={false}
      pagination={pagination}
    ></DataTable>
  );
};
