import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";

import type { Nullable } from "../../type";
import {
  getInstillModelAPIClient,
  ListModelVersionsResponse,
} from "../../vdp-sdk";

export function useInfiniteModelVersions({
  accessToken,
  enabledQuery,
  modelName,
  pageSize,
}: {
  accessToken: Nullable<string>;
  enabledQuery: boolean;
  modelName: Nullable<string>;
  pageSize?: number;
}): UseInfiniteQueryResult<InfiniteData<ListModelVersionsResponse>, Error> {
  let enabled = false;

  if (modelName && enabledQuery) {
    enabled = true;
  }

  const queryKey = ["available-model-versions", modelName, "infinite"];

  return useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam }) => {
      if (!modelName) {
        return Promise.reject(new Error("modelName not provided"));
      }

      const client = getInstillModelAPIClient({
        accessToken: accessToken ?? undefined,
      });

      const versions = await client.model.listNamespaceModelVersions({
        pageSize: pageSize || undefined,
        page: pageParam || undefined,
        namespaceModelName: modelName,
        enablePagination: true,
      });

      return Promise.resolve(versions);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const versionsLastPage = Math.max(
        Math.ceil(lastPage.totalSize / lastPage.pageSize) - 1,
        0,
      );

      if (lastPage.page >= versionsLastPage) {
        return null;
      }

      return lastPage.page + 1;
    },
    enabled,
  });
}
