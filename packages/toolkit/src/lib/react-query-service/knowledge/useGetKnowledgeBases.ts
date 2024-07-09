// useGetKnowledgeBases.ts

import { useQuery } from "@tanstack/react-query";
import { createInstillAxiosClient } from "../../vdp-sdk/helper";
import { KnowledgeBase } from "../../vdp-sdk/knowledge/types";

async function getKnowledgeBases({
  ownerId,
  accessToken,
}: {
  ownerId: string;
  accessToken: string | null;
}): Promise<KnowledgeBase[]> {
  if (!accessToken) {
    return Promise.reject(new Error("accessToken not provided"));
  }
  const client = createInstillAxiosClient(accessToken, true);
  const response = await client.get<{
    knowledge_bases: KnowledgeBase[];
  }>(`/owners/${ownerId}/knowledge-bases`);
  return response.data.knowledge_bases;
}

export function useGetKnowledgeBases({
  accessToken,
  ownerId,
  enabled,
}: {
  accessToken: string | null;
  ownerId: string | null;
  enabled: boolean;
}) {
  return useQuery({
    queryKey: ["knowledgeBases", ownerId],
    queryFn: () => {
      if (!ownerId || !accessToken) {
        throw new Error("ownerId and accessToken are required");
      }
      return getKnowledgeBases({ ownerId, accessToken });
    },
    enabled: enabled && !!ownerId && !!accessToken,
  });
}
