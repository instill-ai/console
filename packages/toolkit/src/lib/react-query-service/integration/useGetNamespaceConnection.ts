"use client";

import type { Nullable, ResourceView } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useGetNamespaceConnection({
  enabled,
  view,
  connectionId,
  namespaceId,
  accessToken,
}: {
  connectionId: Nullable<string>;
  namespaceId: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  view: Nullable<ResourceView>;
}) {
  return useQuery({
    queryKey: queryKeyStore.integration.getUseGetNamespaceConnectionQueryKey({
      connectionId,
      namespaceId,
      view,
    }),
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken is required"));
      }

      if (!connectionId) {
        return Promise.reject(new Error("connectionId is required"));
      }

      if (!namespaceId) {
        return Promise.reject(new Error("namespaceId is required"));
      }

      const client = getInstillAPIClient({ accessToken });

      const res = await client.mgmt.integration.getNamespaceConnection({
        connectionId,
        namespaceId,
        view: view ?? "VIEW_BASIC",
      });

      return Promise.resolve(res.connection);
    },
    enabled: enabled,
  });
}
