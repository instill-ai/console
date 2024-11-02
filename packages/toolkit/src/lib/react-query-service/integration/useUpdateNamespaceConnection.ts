"use client";

import type { Nullable, UpdateNamespaceConnectionRequest } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useUpdateNamespaceConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: UpdateNamespaceConnectionRequest;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken is required"));
      }

      const client = getInstillAPIClient({ accessToken });

      const res =
        await client.core.integration.updateNamespaceConnection(payload);

      return Promise.resolve(res.connection);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey:
          queryKeyStore.integration.getUseGetNamespaceConnectionQueryKey({
            connectionId: variables.payload.connectionId,
            namespaceId: variables.payload.namespaceId,
            view: null,
          }),
      });
      queryClient.invalidateQueries({
        queryKey:
          queryKeyStore.integration.getUseInfiniteListNamespaceConnectionsQueryKey(
            {
              namespaceId: variables.payload.namespaceId,
              filter: null,
            },
          ),
      });
    },
  });
}
