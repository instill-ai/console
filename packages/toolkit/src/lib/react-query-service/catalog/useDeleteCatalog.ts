import { getInstillCatalogAPIClient, useMutation, useQueryClient } from "@instill-ai/toolkit";
import { Catalog, Nullable } from "instill-sdk";

export function useDeleteCatalog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ownerId,
      catalogId,
      accessToken,
    }: {
      ownerId: string;
      catalogId: string;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }

      const client = getInstillCatalogAPIClient({ accessToken });
      await client.catalog.deleteCatalog({ ownerId, catalogId });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["catalogs", variables.ownerId],
      });
      queryClient.setQueryData<Catalog[]>(
        ["catalogs", variables.ownerId],
        (oldData) =>
          oldData?.filter((catalog) => catalog.catalogId !== variables.catalogId) || []
      );
    },
  });
}