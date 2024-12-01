"use client";

import type { Agent, Nullable } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillApplicationAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useDeleteNamespaceAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      agentUid,
      namespaceId,
      accessToken,
    }: {
      agentUid: string;
      namespaceId: Nullable<string>;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        throw new Error("accessToken is required");
      }

      if (!namespaceId) {
        throw new Error("namespaceId is required");
      }

      if (!agentUid) {
        throw new Error("agentUid is required");
      }

      const client = getInstillApplicationAPIClient({ accessToken });
      await client.application.deleteNamespaceAgent({
        agentUid,
        namespaceId,
      });

      return Promise.resolve({
        namespaceId,
        agentUid,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.setQueryData<Agent[]>(
        queryKeyStore.application.getUseListNamespaceAgentsQueryKey({
          namespaceId: variables.namespaceId,
        }),
        (prev) => {
          if (!prev) return prev;
          return prev.filter((agent) => agent.agentUid !== variables.agentUid);
        },
      );
    },
  });
}
