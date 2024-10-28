import { getInstillCatalogAPIClient, useMutation, useQueryClient } from "@instill-ai/toolkit";
import { Nullable } from "instill-sdk";

export function useUploadCatalogFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ownerId,
      catalogId,
      payload,
      accessToken,
    }: {
      ownerId: string
      catalogId: string;
      payload: {
        name: string;
        type: string;
        content: string;
      };
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }

      const client = getInstillCatalogAPIClient({ accessToken });
      const file = await client.catalog.uploadCatalogFile({
        ownerId,
        catalogId,
        payload,
      });

      return Promise.resolve(file);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["catalogFiles", variables.ownerId, variables.catalogId],
      });
    },
  });
}