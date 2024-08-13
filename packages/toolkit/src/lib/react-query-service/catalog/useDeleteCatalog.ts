import { useMutation } from "@tanstack/react-query";

import { createInstillAxiosClient } from "../../vdp-sdk/helper";
import { Catalog } from "./types";

async function deleteCatalogMutation({
  ownerId,
  kbId,
  accessToken,
}: {
  ownerId: string;
  kbId: string;
  accessToken: string | null;
}): Promise<Catalog> {
  if (!accessToken) {
    return Promise.reject(new Error("accessToken not provided"));
  }
  const client = createInstillAxiosClient(accessToken, true);
  const response = await client.delete<{
    catalog: Catalog;
  }>(`/namespaces/${ownerId}/catalogs/${kbId}`);
  return response.data.catalog;
}

export function useDeleteCatalog() {
  return useMutation({
    mutationFn: deleteCatalogMutation,
  });
}
