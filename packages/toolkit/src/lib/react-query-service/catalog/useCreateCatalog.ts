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

      const client = getInstillCatalogAPIClient({ accessToken });
      const catalog = await client.catalog.createCatalog({
        namespaceId,
        payload,
      });
      return catalog;
    },
  });
}
