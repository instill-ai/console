import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Catalog, Nullable } from "instill-sdk";

import { getInstillCatalogAPIClient } from "../../sdk-helper";

export function useDeleteCatalog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      namespaceId,
      catalogId,
      accessToken,
    }: {
      namespaceId: string;
      catalogId: string;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }

      const client = getInstillCatalogAPIClient({ accessToken });
      await client.catalog.deleteCatalog({ namespaceId, catalogId });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["catalogs", variables.namespaceId],
      });
      queryClient.setQueryData<Catalog[]>(
        ["catalogs", variables.namespaceId],
        (oldData) =>
          oldData?.filter(
            (catalog) => catalog.catalogId !== variables.catalogId,
          ) || [],
      );
    },
  });
}
