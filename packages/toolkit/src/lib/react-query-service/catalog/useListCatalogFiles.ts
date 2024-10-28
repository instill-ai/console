import { getInstillCatalogAPIClient, useQuery } from "@instill-ai/toolkit";
import { File, Nullable } from "instill-sdk";

export function useListCatalogFiles({
  namespaceId,
  catalogId,
  accessToken,
  enabled,
}: {
  namespaceId: Nullable<string>;
  catalogId: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
}) {
  return useQuery<File[]>({
    queryKey: ["catalogFiles", namespaceId, catalogId],
    queryFn: async () => {
      if (!namespaceId || !accessToken || !catalogId) {
        throw new Error("Required parameters are missing");
      }

      const client = getInstillCatalogAPIClient({ accessToken });
      const files = await client.catalog.listCatalogFiles({
        ownerId: namespaceId,
        catalogId,
        enablePagination: false,
      });

      return Promise.resolve(files);
    },
    enabled: enabled && Boolean(namespaceId) && Boolean(accessToken) && Boolean(catalogId),
  });
}