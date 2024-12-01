"use client";

import type { CreateNamespaceAgentRequest, Nullable } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillApplicationAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useCreateNamespaceAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: CreateNamespaceAgentRequest;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        throw new Error("accessToken is required");
      }

      if (!payload.namespaceId) {
        throw new Error("namespaceId is required");
      }

      const client = getInstillApplicationAPIClient({ accessToken });
      const res = await client.application.createNamespaceAgent(payload);
      return Promise.resolve(res.agent);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeyStore.application.getUseListNamespaceAgentsQueryKey({
          namespaceId: variables.payload.namespaceId,
        }),
      });
    },
  });
}
