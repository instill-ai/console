import { getInstillCatalogAPIClient, useMutation, useQueryClient } from "@instill-ai/toolkit";
import { Nullable } from "instill-sdk";

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