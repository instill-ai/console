import { useMutation } from "@tanstack/react-query";

import { Nullable } from "instill-sdk";
import { getInstillApplicationAPIClient } from "../../vdp-sdk";


export function useCreateCatalog() {
  return useMutation({
    mutationFn: async ({
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
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }

      const client = getInstillApplicationAPIClient({ accessToken });
      const catalog = await client.catalog.createCatalog({
        ownerId,
        payload,
      });
      return catalog;
    },
  });
}
