import { useQuery } from "@tanstack/react-query";

import { Nullable } from "@instill-ai/toolkit";

import { createInstillAxiosClient } from "../../vdp-sdk/helper";
import { File } from "./types";

export function useListKnowledgeBaseFiles({
  namespaceId,
  knowledgeBaseId,
  accessToken,
  enabled,
  pageSize = 100,
  pageToken,
}: {
  namespaceId: Nullable<string> | undefined;
  knowledgeBaseId: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  pageSize?: number;
  pageToken?: string;
}) {
  return useQuery<{ files: File[]; nextPageToken: string | null }>({
    queryKey: ["knowledgeBaseFiles", namespaceId, knowledgeBaseId, pageToken],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }
      if (!namespaceId) {
        throw new Error("namespaceId not provided");
      }
      if (!knowledgeBaseId) {
        throw new Error("knowledgeBaseId not provided");
      }
      const client = createInstillAxiosClient(accessToken, true);
      const response = await client.get<{
        files: File[];
        nextPageToken: string | null;
      }>(`/namespaces/${namespaceId}/catalogs/${knowledgeBaseId}/files`, {
        params: {
          pageSize,
          pageToken,
        },
      });
      return response.data;
    },
    enabled,
  });
}
