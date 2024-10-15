import { useInfiniteQuery } from "@tanstack/react-query";

import type { Nullable } from "../../type";
import { getInstillAPIClient } from "../../vdp-sdk";

export function useInfiniteConnectionPipelines({
  namespaceId,
  connectionId,
  accessToken,
  enabled,
  filter,
}: {
  namespaceId: Nullable<string>;
  connectionId: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  filter: Nullable<string>;
}) {
  const queryKey = [
    "integration-connection-pipelines",
    namespaceId,
    connectionId,
    "infinite",
  ];

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

      if (!connectionId) {
        return Promise.reject(new Error("connectionId not provided"));
      }

      const client = getInstillAPIClient({ accessToken });

      const pipelines = await client.core.integration.getConnectionPipelines({
        namespaceId,
        connectionId,
        pageSize: 100,
        pageToken: pageParam ?? null,
        filter,
        enablePagination: true,
      });

      return Promise.resolve(pipelines);
    },
    initialPageParam: "",
    getNextPageParam: (lastPage) => {
      if (lastPage.nextPageToken === "") {
        return null;
      }

      return lastPage.nextPageToken;
    },
    enabled,
  });
}
