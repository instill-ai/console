import { useQuery } from "@tanstack/react-query";
import { getInstillCatalogAPIClient } from "../../sdk-helper";
import { Nullable } from "instill-sdk";

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
      if (!accessToken || !fileUid) {
        throw new Error("Required parameters are missing");
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