import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CatalogFile, Nullable } from "instill-sdk";

import { getInstillCatalogAPIClient } from "../../sdk-helper";

export function useProcessCatalogFiles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      fileUids,
      accessToken,
      requesterUid,
    }: {
      fileUids: string[];
      accessToken: Nullable<string>;
      requesterUid: Nullable<string>;
    }): Promise<CatalogFile[]> => {
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }
      if (!requesterUid) {
        throw new Error("requesterUid not provided");
      }
      if (!fileUids || fileUids.length === 0) {
        throw new Error("fileUids must be a non-empty array");
      }

      const client = getInstillCatalogAPIClient({ accessToken });
      const files = await client.catalog.processCatalogFiles({
        fileUids,
        requesterUid,
      });

      return files;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalogFiles"] });
    },
  });
}
