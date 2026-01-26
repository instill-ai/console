"use client";

import { useQuery } from "@tanstack/react-query";
import { Nullable, ResourceView } from "instill-sdk";

import { getInstillAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useListNamespaceConnections({
  enabled,
  view,
  namespaceId,
  filter,
  accessToken,
}: {
  accessToken: Nullable<string>;
  namespaceId: Nullable<string>;
  enabled: boolean;
  filter: Nullable<string>;
  view: Nullable<ResourceView>;
}) {
  return useQuery({
    queryKey: queryKeyStore.integration.getUseListNamespaceConnectionsQueryKey({
      namespaceId,
      view,
    }),
    queryFn: async () => {
      if (!namespaceId) {
        return Promise.reject(new Error("namespaceId is required"));
      }

      if (!accessToken) {
        return Promise.reject(new Error("accessToken is required"));
      }

      const client = getInstillAPIClient({
        accessToken: accessToken ?? undefined,
      });

      const res = await client.mgmt.integration.listNamespaceConnections({
        namespaceId,
        filter: filter ?? undefined,
      });

      return Promise.resolve(res.connections);
    },
    enabled: enabled,
  });
}
