import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Catalog, Nullable } from "instill-sdk";

import { getInstillCatalogAPIClient } from "../../sdk-helper";

export function useUpdateCatalog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      namespaceId,
      catalogId,
      payload,
      accessToken,
    }: {
      namespaceId: string;
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
      if (!namespaceId) {
        throw new Error("namespaceId not provided");
      }
      if (!catalogId) {
        throw new Error("catalogId not provided");
      }
      if (!payload || !payload.name) {
        throw new Error("payload with at least a name is required");
      }

      const client = getInstillCatalogAPIClient({ accessToken });
      const catalog = await client.catalog.updateCatalog({
        namespaceId,
        catalogId,
        ...payload,
      });

      return Promise.resolve(catalog);
    },
    onSuccess: (updatedCatalog, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["catalogs", variables.namespaceId],
      });
      queryClient.setQueryData<Catalog[]>(
        ["catalogs", variables.namespaceId],
        (oldData) =>
          oldData?.map((catalog) =>
            catalog.catalogId === variables.catalogId
              ? updatedCatalog
              : catalog,
          ) || [],
      );
    },
  });
}
