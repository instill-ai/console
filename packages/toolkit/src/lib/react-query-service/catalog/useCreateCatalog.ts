import { useMutation } from "@tanstack/react-query";
import { Nullable } from "instill-sdk";

import { getInstillCatalogAPIClient } from "../../sdk-helper";

export function useCreateCatalog() {
  return useMutation({
    mutationFn: async ({
      payload,
      namespaceId,
      accessToken,
    }: {
      payload: {
        name: string;
        description?: string;
        tags?: string[];
        namespaceId: string;
      };
      namespaceId: string;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }
      if (!namespaceId) {
        throw new Error("namespaceId not provided");
      }
      if (!payload) {
        throw new Error("payload must be provided");
      }
      if (!payload.name) {
        throw new Error("payload.name is required");
      }

      const client = getInstillCatalogAPIClient({ accessToken });
      const catalog = await client.catalog.createCatalog({
        namespaceId,
        payload,
      });
      return catalog;
    },
  });
}
