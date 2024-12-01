"use client";

import type { Agent, Nullable, UpdateNamespaceAgentRequest } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillApplicationAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useUpdateNamespaceAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: UpdateNamespaceAgentRequest;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        throw new Error("accessToken is required");
      }

      if (!payload.namespaceId) {
        throw new Error("namespaceId is required");
      }

      if (!payload.agentUid) {
        throw new Error("agentUid is required");
      }

      const client = getInstillApplicationAPIClient({ accessToken });
      const agent = await client.application.updateNamespaceAgent(payload);

      return Promise.resolve(agent.agent);
    },
    onSuccess: (agent, variables) => {
      queryClient.setQueryData<Agent[]>(
        queryKeyStore.application.getUseListNamespaceAgentsQueryKey({
          namespaceId: variables.payload.namespaceId,
        }),
        (prev) => {
          if (!prev) {
            return [agent];
          }

          return [
            ...prev.filter((a) => a.agentUid !== variables.payload.agentUid),
            agent,
          ];
        },
      );

      queryClient.invalidateQueries({
        queryKey: queryKeyStore.application.getUseListNamespaceAgentsQueryKey({
          namespaceId: variables.payload.namespaceId,
        }),
      });
    },
  });
}
