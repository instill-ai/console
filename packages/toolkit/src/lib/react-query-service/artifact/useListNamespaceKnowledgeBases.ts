"use client";

import type { Nullable } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { getInstillArtifactAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useListNamespaceKnowledgeBases({
  accessToken,
  namespaceId,
  enabled,
}: {
  accessToken: Nullable<string>;
  namespaceId: Nullable<string>;
  enabled: boolean;
}) {
  return useQuery({
    queryKey:
      queryKeyStore.knowledgeBase.getUseListNamespaceKnowledgeBasesQueryKey({
        namespaceId,
      }),
    queryFn: async () => {
      if (!namespaceId) {
        throw new Error("namespaceId is required");
      }

      if (!accessToken) {
        throw new Error("accessToken is required");
      }

      const client = getInstillArtifactAPIClient({ accessToken });
      const res = await client.artifact.listKnowledgeBases({
        namespaceId,
      });

      return Promise.resolve(res.knowledgeBases);
    },
    enabled: enabled && Boolean(namespaceId) && Boolean(accessToken),
  });
}
