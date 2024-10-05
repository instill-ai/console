import { useInfiniteQuery } from "@tanstack/react-query";

import type { Nullable } from "../../type";
import { getInstillAPIClient } from "../../vdp-sdk";

export function useInfiniteIntegrationConnections({
  namespaceId,
  accessToken,
  enabled,
  retry,
  filter,
}: {
  namespaceId: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  retry?: false | number;
  filter: Nullable<string>;
}) {
  const queryKey = ["integration-connections", namespaceId, "infinite"];

  if (filter) {
    queryKey.push(filter);
  }

  return useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      if (!namespaceId) {
        return Promise.reject(new Error("namespaceId not provided"));
      }

      const client = getInstillAPIClient({ accessToken });

      const connections =
        await client.core.integration.getIntegrationConnections({
          namespaceId,
          pageSize: 100,
          pageToken: pageParam ?? null,
          filter,
          enablePagination: true,
        });

      return Promise.resolve(connections);
    },
    initialPageParam: "",
    getNextPageParam: (lastPage) => {
      if (lastPage.nextPageToken === "") {
        return null;
      }

      return lastPage.nextPageToken;
    },
    enabled,
    retry: retry === false ? false : retry ? retry : 3,
  });
}
