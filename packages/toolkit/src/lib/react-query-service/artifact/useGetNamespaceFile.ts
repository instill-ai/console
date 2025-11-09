"use client";

import type { File, Nullable } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { getInstillArtifactAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useGetNamespaceFile({
  fileUid,
  accessToken,
  enabled,
  knowledgeBaseId,
  namespaceId,
}: {
  fileUid: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  knowledgeBaseId: Nullable<string>;
  namespaceId: Nullable<string>;
}) {
  return useQuery<File & { content: string; summaryContent: string }>({
    queryKey:
      queryKeyStore.knowledgeBase.getUseNamespaceKnowledgeBaseFileQueryKey({
        fileUid,
        knowledgeBaseId,
        namespaceId,
      }),
    queryFn: async () => {
      if (!accessToken) {
        throw new Error("accessToken is required");
      }

      if (!fileUid) {
        throw new Error("fileUid is required");
      }

      if (!knowledgeBaseId) {
        throw new Error("knowledgeBaseId is required");
      }

      if (!namespaceId) {
        throw new Error("namespaceId is required");
      }

      const client = getInstillArtifactAPIClient({ accessToken });

      // Fetch file metadata with VIEW_CONTENT to get the markdown content
      const contentRes = await client.artifact.getFile({
        namespaceId,
        knowledgeBaseId: knowledgeBaseId,
        fileId: fileUid,
        view: "VIEW_CONTENT",
      });

      // Fetch file metadata with VIEW_SUMMARY to get the summary content
      const summaryRes = await client.artifact.getFile({
        namespaceId,
        knowledgeBaseId: knowledgeBaseId,
        fileId: fileUid,
        view: "VIEW_SUMMARY",
      });

      // Fetch the markdown content from the pre-signed URL
      let content = "";
      if (contentRes.derivedResourceUri) {
        try {
          const contentResponse = await fetch(contentRes.derivedResourceUri);
          if (contentResponse.ok) {
            content = await contentResponse.text();
          }
        } catch (error) {
          console.error("Failed to fetch file content:", error);
        }
      }

      // Fetch the summary content from the pre-signed URL
      let summaryContent = "";
      if (summaryRes.derivedResourceUri) {
        try {
          const summaryResponse = await fetch(summaryRes.derivedResourceUri);
          if (summaryResponse.ok) {
            summaryContent = await summaryResponse.text();
          }
        } catch (error) {
          console.error("Failed to fetch file summary:", error);
        }
      }

      return Promise.resolve({ ...contentRes.file, content, summaryContent });
    },
    enabled: enabled && Boolean(accessToken) && Boolean(fileUid),
  });
}
