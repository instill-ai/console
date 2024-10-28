import type { Nullable } from "instill-sdk";
import { useMutation } from "@tanstack/react-query";

import { createInstillAxiosClient } from "../../sdk-helper";
import { Catalog } from "./types";

async function updateCatalogMutation({
  payload,
  ownerId,
  catalogId,
  accessToken,
}: {
  payload: {
    name: string;
    description?: string;
    tags?: string[];
  };
  ownerId: string;
  catalogId: string;
  accessToken: Nullable<string>;
}): Promise<Catalog> {
  if (!accessToken) {
    return Promise.reject(new Error("accessToken not provided"));
  }
  const client = createInstillAxiosClient(accessToken, true);
  const response = await client.put<{
    catalog: Catalog;
  }>(`/namespaces/${ownerId}/catalogs/${catalogId}`, payload);
  return response.data.catalog;
}

export function useUpdateCatalog() {
  return useMutation({
    mutationFn: updateCatalogMutation,
  });
}
