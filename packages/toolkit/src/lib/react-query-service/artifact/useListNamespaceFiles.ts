"use client";

import type { File, Nullable } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { getInstillArtifactAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";
import { QueryBaseProps } from "../types";

export function useListNamespaceFiles({
  namespaceId,
  knowledgeBaseId,
  accessToken,
  enabled,
  refetchInterval,
}: {
  namespaceId: Nullable<string>;
  knowledgeBaseId: Nullable<string>;
} & QueryBaseProps<File[]>) {
  return useQuery<File[]>({
    queryKey:
      queryKeyStore.knowledgeBase.getUseListNamespaceKnowledgeBaseFilesQueryKey(
        {
          namespaceId,
          knowledgeBaseId,
        },
      ),
    queryFn: async () => {
      if (!accessToken) {
        throw new Error("accessToken is required");
      }

      if (!namespaceId) {
        throw new Error("namespaceId is required");
      }

      if (!knowledgeBaseId) {
        throw new Error("knowledgeBaseId is required");
      }

      const client = getInstillArtifactAPIClient({ accessToken });
      const res = await client.artifact.listFiles({
        namespaceId,
        knowledgeBaseId,
      });

      return Promise.resolve(res.files);
    },
    refetchInterval,
    enabled:
      enabled &&
      Boolean(namespaceId) &&
      Boolean(knowledgeBaseId) &&
      Boolean(accessToken),
  });
}
