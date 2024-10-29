import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getInstillCatalogAPIClient } from "../../sdk-helper";
import { Catalog, Nullable } from "instill-sdk";

export function useUpdateCatalog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ownerId,
      catalogId,
      payload,
      accessToken,
    }: {
      ownerId: string;
      catalogId: string;
      payload: {
        name: string;
        description?: string;
        tags?: string[];
      };
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }

      const client = getInstillCatalogAPIClient({ accessToken });
      const catalog = await client.catalog.updateCatalog({
        ownerId,
        catalogId,
        ...payload,
      });

      return Promise.resolve(catalog);
    },
    onSuccess: (updatedCatalog, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["catalogs", variables.ownerId],
      });
      queryClient.setQueryData<Catalog[]>(
        ["catalogs", variables.ownerId],
        (oldData) =>
          oldData?.map((catalog) =>
            catalog.catalogId === variables.catalogId ? updatedCatalog : catalog
          ) || []
      );
    },
  });
}