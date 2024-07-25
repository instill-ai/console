import { useQuery } from "@tanstack/react-query";
import { createInstillAxiosClient } from "../../vdp-sdk/helper";
import { Nullable } from "@instill-ai/toolkit";
import { File } from "../../../../../sdk/src/vdp/artifact/types";

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
        `/namespaces/${ownerId}/knowledge-bases/${knowledgeBaseId}/files`
      );
      return response.data.files;
    },
    enabled,
  });
}