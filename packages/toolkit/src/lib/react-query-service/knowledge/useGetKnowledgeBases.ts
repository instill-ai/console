import { useQuery } from "@tanstack/react-query";

import { Nullable } from "@instill-ai/toolkit";

import { getInstillAPIClient } from "../../vdp-sdk";
import { KnowledgeBase } from "./types";

export function useGetKnowledgeBases({
  accessToken,
  ownerId,
  enabled,
}: {
  accessToken: Nullable<string>;
  ownerId: Nullable<string>;
  enabled: boolean;
}) {
  return useQuery<KnowledgeBase[]>({
    queryKey: ["knowledgeBases", ownerId],
    queryFn: async () => {
      if (!ownerId || !accessToken) {
        throw new Error("ownerId and accessToken are required");
      }
      const client = getInstillAPIClient({ accessToken });
      const response = await client.vdp.artifact.listKnowledgeBases({
        ownerId,
      });
      return response.knowledgeBases;
    },
    enabled: enabled && !!ownerId && !!accessToken,
  });
}
