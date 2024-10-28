"use client";

import { useQuery } from "@tanstack/react-query";
import { Nullable, ResourceView } from "instill-sdk";

import { getInstillAPIClient } from "../../sdk-helper";

export function useIntegrationConnections({
  enabled,
  view = "VIEW_BASIC",
  namespaceId,
  filter,
  accessToken,
}: {
  accessToken: Nullable<string>;
  namespaceId: Nullable<string>;
  enabled: boolean;
  filter: Nullable<string>;
  view: ResourceView;
}) {
  return useQuery({
    queryKey: ["integration-connections", namespaceId, view],
    queryFn: async () => {
      if (!namespaceId) {
        return Promise.reject(new Error("namespaceId not provided"));
      }

      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillAPIClient({
        accessToken: accessToken ?? undefined,
      });

      const data = await client.core.integration.getIntegrationConnections({
        namespaceId,
        filter,
        enablePagination: false,
        pageSize: 10,
      });

      return Promise.resolve(data);
    },
    enabled: enabled,
  });
}
