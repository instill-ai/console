import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CatalogFile, Nullable } from "instill-sdk";

import { getInstillCatalogAPIClient } from "../../sdk-helper";

export function useProcessCatalogFiles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      fileUids,
      accessToken,
      namespaceUid,
    }: {
      fileUids: string[];
      accessToken: Nullable<string>;
      namespaceUid: Nullable<string>;
    }): Promise<CatalogFile[]> => {
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }

      if (!namespaceUid) {
        throw new Error("namespaceUid not provided");
      }

      const client = getInstillCatalogAPIClient({ accessToken });
      const files = await client.catalog.processCatalogFiles({
        fileUids,
        namespaceUid,
      });

      return files;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalogFiles"] });
    },
  });
}
