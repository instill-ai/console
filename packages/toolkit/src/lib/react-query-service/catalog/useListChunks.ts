import { getInstillCatalogAPIClient, useQuery } from "@instill-ai/toolkit";
import { Chunk, Nullable } from "instill-sdk";

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