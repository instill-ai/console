"use client";

import type { Nullable } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useDeleteIntegrationConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      namespaceId,
      connectionId,
      accessToken,
    }: {
      namespaceId: string;
      connectionId: string;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken is required"));
      }

      const client = getInstillAPIClient({ accessToken });

      const res = await client.mgmt.integration.deleteNamespaceConnection({
        namespaceId,
        connectionId,
      });

      return Promise.resolve(res);
    },
    onSuccess: (_, variables) => {
      queryClient.removeQueries({
        queryKey:
          queryKeyStore.integration.getUseGetNamespaceConnectionQueryKey({
            connectionId: variables.connectionId,
            namespaceId: variables.namespaceId,
            view: null,
          }),
      });
      queryClient.invalidateQueries({
        queryKey:
          queryKeyStore.integration.getUseInfiniteListNamespaceConnectionsQueryKey(
            {
              namespaceId: variables.namespaceId,
              filter: null,
            },
          ),
      });
    },
  });
}
