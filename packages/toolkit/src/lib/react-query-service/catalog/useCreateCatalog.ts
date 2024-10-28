import { useMutation } from "@tanstack/react-query";

import { createInstillAxiosClient } from "../../sdk-helper";
import { Catalog } from "./types";

async function createCatalogMutation({
  payload,
  ownerId,
  accessToken,
}: {
  payload: {
    name: string;
    description?: string;
    tags?: string[];
    ownerId: string;
  };
  ownerId: string;
  accessToken: string | null;
}): Promise<Catalog> {
  if (!accessToken) {
    return Promise.reject(new Error("accessToken not provided"));
  }
  const client = createInstillAxiosClient(accessToken, true);
  const response = await client.post<{
    catalog: Catalog;
  }>(`/namespaces/${ownerId}/catalogs`, payload);
  return response.data.catalog;
}

export function useCreateCatalog() {
  return useMutation({
    mutationFn: createCatalogMutation,
  });
}
