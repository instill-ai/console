import { useMutation } from "@tanstack/react-query";

import { createInstillAxiosClient } from "../../vdp-sdk/helper";
import { KnowledgeBase } from "./types";

async function deleteCatalogMutation({
  ownerId,
  kbId,
  accessToken,
}: {
  ownerId: string;
  kbId: string;
  accessToken: string | null;
}): Promise<KnowledgeBase> {
  if (!accessToken) {
    return Promise.reject(new Error("accessToken not provided"));
  }
  const client = createInstillAxiosClient(accessToken, true);
  const response = await client.delete<{
    knowledgeBase: KnowledgeBase;
  }>(`/namespaces/${ownerId}/catalogs/${kbId}`);
  return response.data.knowledgeBase;
}

export function useDeleteCatalog() {
  return useMutation({
    mutationFn: deleteCatalogMutation,
  });
}
