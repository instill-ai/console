import { useQuery } from "@tanstack/react-query";

import { Nullable } from "@instill-ai/toolkit";

import { getInstillAPIClient } from "../../vdp-sdk";
import { File } from "./types";

export function useListKnowledgeBaseFiles({
  namespaceId,
  knowledgeBaseId,
  accessToken,
  enabled,
}: {
  namespaceId: Nullable<string>;
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
      const client = getInstillAPIClient({ accessToken });
      const response = await client.vdp.artifact.listKnowledgeBaseFiles({
        namespaceId,
        kbId: knowledgeBaseId,
      });
      return response.files;
    },
    enabled,
  });
}
