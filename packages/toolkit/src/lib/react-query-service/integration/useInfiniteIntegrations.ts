import { useInfiniteQuery } from "@tanstack/react-query";

import type { Nullable } from "../../type";
import { getInstillAPIClient } from "../../sdk-helper";

export function useInfiniteIntegrations({
  accessToken,
  enabled,
  filter,
}: {
  accessToken: Nullable<string>;
  enabled: boolean;
  filter: Nullable<string>;
}) {
  const queryKey = ["integrations", "infinite"];

  if (filter) {
    queryKey.push(filter);
  }

  return useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillAPIClient({ accessToken });

      const integrations = await client.core.integration.getIntegrations({
        pageSize: 100,
        pageToken: pageParam ?? null,
        filter,
        enablePagination: true,
      });

      return Promise.resolve(integrations);
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
