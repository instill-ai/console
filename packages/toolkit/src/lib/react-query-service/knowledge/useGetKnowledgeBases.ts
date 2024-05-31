import { useQuery } from "@tanstack/react-query";
import { createInstillAxiosClient } from "../../vdp-sdk/helper";
import { KnowledgeBase } from "../../vdp-sdk/knowledge/types";

export function useGetKnowledgeBases({
  accessToken,
  uid,
  enabled,
  retry,
}: {
  accessToken: string | null;
  uid: string;
  enabled: boolean;
  retry?: false | number;
}) {
  return useQuery<KnowledgeBase[], Error>({
    queryKey: ["knowledge-bases", uid],
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }
      const client = createInstillAxiosClient(accessToken);
      const response = await client.get<{
        body: {
          knowledge_bases: KnowledgeBase[];
        };
        error_msg: string;
        status_code: number;
      }>(`/users/${uid}/knowledge-base`);
      return response.data.body.knowledge_bases;
    },
    enabled,
    retry: retry === false ? false : retry ?? 3,
  });
}