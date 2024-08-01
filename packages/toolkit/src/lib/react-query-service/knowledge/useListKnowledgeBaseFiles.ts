import { useQuery } from "@tanstack/react-query";

import { Nullable } from "@instill-ai/toolkit";

import { getInstillAPIClient } from "../../vdp-sdk";
import { File } from "./types";

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
      const client = getInstillAPIClient({ accessToken });
      const response = await client.vdp.artifact.listKnowledgeBaseFiles({
        ownerId,
        kbId: knowledgeBaseId,
      });
      return response.files;
    },
    enabled,
  });
}
