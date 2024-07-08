import { /* useEffect, useMemo, */ useState } from "react";
import { ColumnDef, PaginationState } from "@tanstack/react-table";

import { Button, DataTable } from "@instill-ai/design-system";

import {
  /* InstillStore,
  Model,
  ModelVersion, */
  Pipeline,
  PipelineRelease,
  /* useInfiniteModelVersions,
  useInstillStore,
  useShallow, */
  useRouteInfo,
} from "../../../lib";
import { getHumanReadableStringFromTime } from "../../../server";
import { useSearchParams, useRouter } from "next/navigation";

export type PipelineVersionsProps = {
  pipeline?: Pipeline;
  releases: PipelineRelease[];
};

/* const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
}); */

export const PipelineVersions = ({ pipeline, releases }: PipelineVersionsProps) => {
  const router = useRouter();
  const routeInfo = useRouteInfo();
  const searchParams = useSearchParams();
  const currentVersion = searchParams.get("version");
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  /*const { accessToken, enabledQuery } = useInstillStore(useShallow(selector)); */
  const columns: ColumnDef<PipelineRelease>[] = [
    {
      accessorKey: "id",
      header: () => <div className="text-left">Version</div>,
      cell: ({ row }) => {
        return (
          <div className="font-normal text-semantic-bg-secondary-secondary">
            {row.getValue("id")}
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
    {
      accessorKey: "createdTime",
      header: () => null,
      cell: ({ row }) => {
        const version = row.getValue('id') as string;
        const isActive = version === currentVersion;

        return (
          !isActive
            ? (
              <div className="flex flex-row justify-end">
                <Button
                  disabled={isActive}
                  onClick={() => onTestVersion(version)}
                >
                  Test
                </Button>
              </div>
            )
            : null
        );
      },
    },
  ];

  const onTestVersion = (version: string) => {
    if(!pipeline) {
      return;
    }

    const newSearchParams = new URLSearchParams();
    newSearchParams.set('version', version);

    const combinedSearchParams = new URLSearchParams({
      ...Object.fromEntries(searchParams),
      ...Object.fromEntries(newSearchParams),
    });

    router.replace(
      `/${routeInfo.data.namespaceId}/pipelines/${pipeline?.id}/playground?${combinedSearchParams.toString()}`,
    );
  };

  /* const versions = useInfiniteModelVersions({
    accessToken,
    enabledQuery,
    modelName: model?.name || null,
  }); */

  /* useEffect(() => {
    if (versions.isSuccess && !versions.data.pages[paginationState.pageIndex]) {
      versions.fetchNextPage();
    }
  }, [paginationState.pageIndex, versions]); */

  /* const pageCount = useMemo(() => {
    if (versions.data?.pages[0]) {
      return Math.ceil(
        versions.data.pages[0].totalSize / versions.data.pages[0].pageSize,
      );
    }

    return 1;
  }, [versions.data]); */

  /* const versionList = useMemo(() => {
    return versions.data?.pages.reduce(
      (acc: ModelVersion[], page) => [...acc, ...page.versions],
      [],
    );
  }, [versions.data]); */

  /* const currentPageData = useMemo(() => {
    if (!versionList) {
      return [];
    }

    const offset = paginationState.pageIndex * paginationState.pageSize;

    return versionList.slice(offset, offset + paginationState.pageSize);
  }, [versionList, paginationState]); */

  const onPaginationStateChange = (state: PaginationState) => {
    setPaginationState(state);
  };

  return (
    <div className="[&_table]:table-fixed [&_table_th:nth-child(1)]:w-auto [&_table_th:nth-child(2)]:w-40 [&_table_th:nth-child(3)]:w-28">
      <DataTable
        columns={columns}
        data={releases/* currentPageData */}
        pageSize={paginationState.pageSize}
        isLoading={false
          /* versions.isLoading ||
          versions.isFetching ||
          versions.isFetchingNextPage */
        }
        loadingRows={paginationState.pageSize}
        manualPagination={true}
        pageCount={1}
        onPaginationStateChange={onPaginationStateChange}
        showPageNumbers={false}
        paginationState={paginationState}
      />
    </div>
  );
};
