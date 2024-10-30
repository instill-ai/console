import { useQuery } from "@tanstack/react-query";
import { File, Nullable } from "instill-sdk";

import { getInstillCatalogAPIClient } from "../../sdk-helper";

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
      if (!namespaceId) {
        throw new Error("namespaceId not provided");
      }
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }
      if (!catalogId) {
        throw new Error("catalogId not provided");
      }

      const client = getInstillCatalogAPIClient({ accessToken });
      const files = await client.catalog.listCatalogFiles({
        namespaceId,
        catalogId,
        enablePagination: false,
      });

      return Promise.resolve(files);
    },
    enabled:
      enabled &&
      Boolean(namespaceId) &&
      Boolean(accessToken) &&
      Boolean(catalogId),
  });
}
