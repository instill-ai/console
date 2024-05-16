import { useInfiniteQuery } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import { listModelVersionsQuery } from "../../vdp-sdk";

export function useInfiniteModelVersions({
  accessToken,
  enabledQuery,
  modelName,
  pageSize,
  retry,
}: {
  accessToken: Nullable<string>;
  enabledQuery: boolean;
  modelName: string;
  pageSize?: number;
  retry?: false | number;
}) {
  let enabled = false;

  if (modelName && enabledQuery) {
    enabled = true;
  }

  const queryKey = ["available-model-versions", modelName, "infinite"];

  return useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      if (!modelName) {
        return Promise.reject(new Error("modelName not provided"));
      }

      const data = await listModelVersionsQuery({
        accessToken,
        modelName,
        page: pageParam || null,
        pageSize,
        enablePagination: true,
      });

      return Promise.resolve(data);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const versionsLastPage = Math.max(
        Math.ceil(lastPage.total_size / lastPage.page_size) - 1,
        0
      );

      if (lastPage.page >= versionsLastPage) {
        return null;
      }

      return lastPage.page + 1;
    },
    enabled,
    retry: retry === false ? false : retry ? retry : 3,
  });
}
