import { useQuery } from "@tanstack/react-query";
import { Nullable } from "instill-sdk";

import { getInstillCatalogAPIClient } from "../../sdk-helper";

export function useGetCatalogs({
  accessToken,
  namespaceId,
  enabled,
}: {
  accessToken: Nullable<string>;
  namespaceId: Nullable<string>;
  enabled: boolean;
}) {
  return useQuery({
    queryKey: ["catalogs", namespaceId],
    queryFn: async () => {
      if (!namespaceId) {
        throw new Error("namespaceId not provided");
      }
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }

      const client = getInstillCatalogAPIClient({ accessToken });
      const catalogs = await client.catalog.listCatalogs({
        namespaceId,
        enablePagination: false,
      });

      return Promise.resolve(catalogs);
    },
    enabled: enabled && Boolean(namespaceId) && Boolean(accessToken),
  });
}
