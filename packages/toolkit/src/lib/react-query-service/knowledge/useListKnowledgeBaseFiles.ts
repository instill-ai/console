import { useQuery } from "@tanstack/react-query";

import { Nullable } from "@instill-ai/toolkit";

import { File } from "../../../../../sdk/src/knowledge/types";
import { createInstillAxiosClient } from "../../vdp-sdk/helper";

export function useListKnowledgeBaseFiles({
  namespaceId,
  knowledgeBaseId,
  accessToken,
  enabled,
}: {
  namespaceId: Nullable<string> | undefined;
  knowledgeBaseId: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
}) {
  return useQuery<File[]>({
    queryKey: ["knowledgeBaseFiles", namespaceId, knowledgeBaseId],
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
      const response = await client.get<{ files: File[] }>(
        `/namespaces/${namespaceId}/knowledge-bases/${knowledgeBaseId}/files`,
      );
      return response.data.files;
    },
    enabled,
  });
}
