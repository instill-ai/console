import { useQuery } from "@tanstack/react-query";
import { Nullable } from "instill-sdk";

import { getInstillCatalogAPIClient } from "../../sdk-helper";

export function useGetAllChunks({
  accessToken,
  ownerName,
  catalogId,
  fileUid,
  enabled,
}: {
  accessToken: Nullable<string>;
  ownerName: string;
  catalogId: string;
  fileUid: string | undefined;
  enabled: boolean;
}) {
  return useQuery({
    queryKey: ["chunks", catalogId, fileUid],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }
      if (!fileUid) {
        throw new Error("fileUid not provided");
      }

      const client = getInstillCatalogAPIClient({ accessToken });
      const chunks = await client.catalog.listChunks({
        namespaceId: ownerName,
        catalogId,
        fileUid,
        enablePagination: false,
      });

      return Promise.resolve(chunks);
    },
    enabled: enabled && Boolean(accessToken) && Boolean(fileUid),
  });
}
