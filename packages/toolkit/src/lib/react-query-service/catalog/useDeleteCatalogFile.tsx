import { getInstillApplicationAPIClient, useMutation, useQueryClient } from "@instill-ai/toolkit";
import { Nullable } from "instill-sdk";

export function useDeleteCatalogFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ownerId,
      catalogId,
      fileUid,
      accessToken,
    }: {
      ownerId: string;
      catalogId: string;
      fileUid: string;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }

      const client = getInstillApplicationAPIClient({ accessToken });
      await client.catalog.deleteCatalogFile({
        ownerId,
        catalogId,
        fileId: fileUid,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["catalogFiles", variables.ownerId, variables.catalogId],
      });
    },
  });
}