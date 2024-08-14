import { useMutation } from "@tanstack/react-query";

import { createInstillAxiosClient } from "../../vdp-sdk/helper";
import { Catalog } from "./types";

async function updateCatalogMutation({
  payload,
  ownerId,
  kbId,
  accessToken,
}: {
  payload: {
    name: string;
    description?: string;
    tags?: string[];
  };
  ownerId: string;
  kbId: string;
  accessToken: string | null;
}): Promise<Catalog> {
  if (!accessToken) {
    return Promise.reject(new Error("accessToken not provided"));
  }
  const client = createInstillAxiosClient(accessToken, true);
  const response = await client.put<{
    catalog: Catalog;
  }>(`/namespaces/${ownerId}/catalogs/${kbId}`, payload);
  return response.data.catalog;
}

export function useUpdateCatalog() {
  return useMutation({
    mutationFn: updateCatalogMutation,
  });
}