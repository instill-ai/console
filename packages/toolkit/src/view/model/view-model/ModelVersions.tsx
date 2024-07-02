import { useEffect, useMemo, useState } from "react";
import { ColumnDef, PaginationState } from "@tanstack/react-table";

import { DataTable } from "@instill-ai/design-system";

import { StateLabel } from "../../../components";
import {
  InstillStore,
  Model,
  ModelVersion,
  useInfiniteModelVersions,
  useInstillStore,
  useShallow,
} from "../../../lib";
import { getHumanReadableStringFromTime } from "../../../server";

export type ModelVersionsProps = {
  model?: Model;
};

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const ModelVersions = ({ model }: ModelVersionsProps) => {
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));
  const columns: ColumnDef<ModelVersion>[] = [
    {
      accessorKey: "version",
      header: () => <div className="text-left">Version</div>,
      cell: ({ row }) => {
        return (
          <div className="font-normal text-semantic-bg-secondary-secondary break-all">
            {row.getValue("version")}
          </div>
        );
      },
    },
    {
      accessorKey: "digest",
      header: () => <div className="text-left">Digest</div>,
      cell: ({ row }) => {
        return (
          <div className="font-normal text-semantic-bg-secondary-secondary break-all">
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
            <StateLabel state={row.getValue("state")} />
          </div>
        );
      },
    },
    {
      accessorKey: "updateTime",
      header: () => <div className="text-left">Updated at</div>,
      cell: ({ row }) => {
        return (
          <div className="font-normal text-semantic-bg-secondary-alt-primary">
            {getHumanReadableStringFromTime(
              row.getValue("updateTime"),
              Date.now(),
            )}
          </div>
        );
      },
    },
  ];

  const versions = useInfiniteModelVersions({
    accessToken,
    enabledQuery,
    modelName: model?.name || null,
  });

  useEffect(() => {
    if (versions.isSuccess && !versions.data.pages[paginationState.pageIndex]) {
      versions.fetchNextPage();
    }
  }, [paginationState.pageIndex, versions]);

  const pageCount = useMemo(() => {
    if (versions.data?.pages[0]) {
      return Math.ceil(
        versions.data.pages[0].totalSize / versions.data.pages[0].pageSize,
      );
    }

    return 1;
  }, [versions.data]);

  const versionList = useMemo(() => {
    return versions.data?.pages.reduce(
      (acc: ModelVersion[], page) => [...acc, ...page.versions],
      [],
    );
  }, [versions.data]);

  const currentPageData = useMemo(() => {
    if (!versionList) {
      return [];
    }

    const offset = paginationState.pageIndex * paginationState.pageSize;

    return versionList.slice(offset, offset + paginationState.pageSize);
  }, [versionList, paginationState]);

  const onPaginationStateChange = (state: PaginationState) => {
    setPaginationState(state);
  };

  return (
    <div
      className="[&_table]:table-fixed [&_table_td]:align-top [&_table_th:nth-child(1)]:w-60 [&_table_th:nth-child(2)]:w-auto [&_table_th:nth-child(3)]:w-40 [&_table_th:nth-child(4)]:w-52"
    >
      <DataTable
        columns={columns}
        data={currentPageData}
        pageSize={paginationState.pageSize}
        isLoading={
          versions.isLoading || versions.isFetching || versions.isFetchingNextPage
        }
        loadingRows={paginationState.pageSize}
        manualPagination={true}
        pageCount={pageCount}
        onPaginationStateChange={onPaginationStateChange}
        showPageNumbers={false}
        paginationState={paginationState}
      />
    </div>
  );
};
