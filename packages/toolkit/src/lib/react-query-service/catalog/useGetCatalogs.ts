import { getInstillCatalogAPIClient, useQuery } from "@instill-ai/toolkit";
import { Nullable } from "instill-sdk";

export function useGetCatalogs({
  accessToken,
  ownerId,
  enabled,
}: {
  accessToken: Nullable<string>;
  ownerId: Nullable<string>;
  enabled: boolean;
}) {
  return useQuery({
    queryKey: ["catalogs", ownerId],
    queryFn: async () => {
      if (!ownerId || !accessToken) {
        throw new Error("Both ownerId and accessToken are required");
      }

      const client = getInstillCatalogAPIClient({ accessToken });
      const catalogs = await client.catalog.listCatalogs({
        ownerId,
        enablePagination: false,
      });

      return Promise.resolve(catalogs);
    },
    enabled: enabled && Boolean(ownerId) && Boolean(accessToken),
  });
}