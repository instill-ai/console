import { useQuery } from "@tanstack/react-query";
import { Chunk, Nullable } from "instill-sdk";

import { getInstillCatalogAPIClient } from "../../sdk-helper";

export function useListChunks({
  catalogId,
  accessToken,
  enabled,
  namespaceId,
  fileUid,
}: {
  catalogId: string;
  accessToken: Nullable<string>;
  enabled: boolean;
  namespaceId: string;
  fileUid: string;
}) {
  return useQuery<Chunk[]>({
    queryKey: ["chunks", catalogId, fileUid],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }

      const client = getInstillCatalogAPIClient({ accessToken });
      const chunks = await client.catalog.listChunks({
        namespaceId,
        catalogId,
        fileUid,
        enablePagination: false,
      });

      return Promise.resolve(chunks);
    },
    enabled: enabled && Boolean(accessToken),
  });
}
