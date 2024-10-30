import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Nullable } from "instill-sdk";

import { getInstillCatalogAPIClient } from "../../sdk-helper";

export function useDeleteCatalogFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      fileUid,
      accessToken,
    }: {
      fileUid: string;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }
      if (!fileUid) {
        throw new Error("fileUid not provided");
      }

      const client = getInstillCatalogAPIClient({ accessToken });
      await client.catalog.deleteCatalogFile({
        fileUid,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalogFiles"] });
    },
  });
}
