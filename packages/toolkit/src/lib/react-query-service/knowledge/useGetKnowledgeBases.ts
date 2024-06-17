import { useQuery } from "@tanstack/react-query";
import { createInstillAxiosClient } from "../../vdp-sdk/helper";
import { KnowledgeBase } from "../../vdp-sdk/knowledge/types";
import { Nullable } from "@instill-ai/design-system";

async function getKnowledgeBasesQuery({
  accessToken,
  uid,
}: {
  accessToken: Nullable<string>;
  uid: Nullable<string>;
}): Promise<KnowledgeBase[]> {
  if (!accessToken) {
    return Promise.reject(new Error("accessToken not provided"));
  }
  const client = createInstillAxiosClient(accessToken, true);
  const response = await client.get<{
    body: {
      knowledge_bases: KnowledgeBase[];
    };
    error_msg: string;
    status_code: number;
  }>(`/users/${uid}/knowledge-base`);
  return response.data.body.knowledge_bases;
}

export function useGetKnowledgeBases({
  accessToken,
  uid,
  enabled,
  retry,
}: {
  accessToken: Nullable<string>;
  uid: Nullable<string>;
  enabled: boolean;
  retry?: false | number;
}) {
  return useQuery<KnowledgeBase[], Error>({
    queryKey: ["knowledge-bases", uid],
    queryFn: () => getKnowledgeBasesQuery({ accessToken, uid }),
    enabled,
    retry: retry === false ? false : retry ?? 3,
  });
}
