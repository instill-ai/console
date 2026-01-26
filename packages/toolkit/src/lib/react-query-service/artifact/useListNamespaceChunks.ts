"use client";

import type { Nullable } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { getInstillArtifactAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useListNamespaceChunks({
  accessToken,
  namespaceId,
  knowledgeBaseId,
  fileUid,
  chunkUids,
  enabled,
}: {
  accessToken: Nullable<string>;
  namespaceId: Nullable<string>;
  knowledgeBaseId: Nullable<string>;
  fileUid: Nullable<string>;
  chunkUids: Nullable<string[]>;
  enabled: boolean;
}) {
  let enabledQuery = false;

  if (enabled && accessToken && namespaceId && knowledgeBaseId && fileUid) {
    enabledQuery = true;
  }

  return useQuery({
    queryKey:
      queryKeyStore.knowledgeBase.getUseListNamespaceKnowledgeBaseChunksQueryKey(
        {
          namespaceId,
          knowledgeBaseId,
          fileUid,
          chunkUids,
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

      if (!fileUid) {
        throw new Error("fileUid is required for listChunks");
      }

      const client = getInstillArtifactAPIClient({ accessToken });
      const res = await client.artifact.listChunks({
        namespaceId,
        knowledgeBaseId,
        fileId: fileUid,
      });

      return Promise.resolve(res.chunks);
    },
    enabled: enabledQuery,
  });
}
