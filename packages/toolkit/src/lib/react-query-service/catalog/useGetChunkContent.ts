import { Nullable } from "instill-sdk";
import { getInstillCatalogAPIClient } from "../../sdk-helper";
import { useQuery } from "@tanstack/react-query";

//Unused for now, might be removed later
export function useGetChunkContent({
  chunkUid,
  accessToken,
  enabled,
  catalogId,
  namespaceId,
}: {
  chunkUid: string;
  accessToken: Nullable<string>;
  enabled: boolean;
  catalogId: string;
  namespaceId: string;
}) {
  return useQuery<string>({
    queryKey: ["chunkContent", chunkUid],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }

      const client = getInstillCatalogAPIClient({ accessToken });
      const content = await client.catalog.getChunkContent({
        namespaceId,
        catalogId,
        chunkUid,
      });

      return Promise.resolve(content.content);
    },
    enabled: enabled && Boolean(accessToken),
  });
}