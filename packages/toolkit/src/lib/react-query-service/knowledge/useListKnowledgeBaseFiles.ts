import { useQuery } from "@tanstack/react-query";

import { Nullable } from "@instill-ai/toolkit";

import { createInstillAxiosClient } from "../../vdp-sdk/helper";
import { File } from "../../vdp-sdk/knowledge/types";

export function useListKnowledgeBaseFiles({
  ownerId,
  knowledgeBaseId,
  accessToken,
  enabled,
}: {
  ownerId: Nullable<string>;
  knowledgeBaseId: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
}) {
  return useQuery<File[]>({
    queryKey: ["knowledgeBaseFiles", ownerId, knowledgeBaseId],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }
      if (!ownerId) {
        throw new Error("ownerId not provided");
      }
      if (!knowledgeBaseId) {
        throw new Error("knowledgeBaseId not provided");
      }
      const client = createInstillAxiosClient(accessToken, true);
      const response = await client.get<{ files: File[] }>(
        `/owners/${ownerId}/knowledge-bases/${knowledgeBaseId}/files`,
      );
      return response.data.files;
    },
    enabled,
  });
}
