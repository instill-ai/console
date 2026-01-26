"use client";

import type { CreateNamespaceConnectionRequest, Nullable } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useCreateIntegrationConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: CreateNamespaceConnectionRequest;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken is required"));
      }

      const client = getInstillAPIClient({ accessToken });

      const res =
        await client.mgmt.integration.createNamespaceConnection(payload);

      return Promise.resolve(res.connection);
    },
    onSuccess: (_, variables) => {
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
