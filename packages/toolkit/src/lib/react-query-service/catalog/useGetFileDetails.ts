import { useQuery } from "@tanstack/react-query";
import { CatalogFile, Nullable } from "instill-sdk";

import { getInstillCatalogAPIClient } from "../../sdk-helper";

export function useGetFileDetails({
  fileUid,
  accessToken,
  enabled,
  catalogId,
  namespaceId,
}: {
  fileUid: string;
  accessToken: Nullable<string>;
  enabled: boolean;
  catalogId: string;
  namespaceId: string;
}) {
  return useQuery<CatalogFile>({
    queryKey: ["fileDetails", fileUid],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }

      const client = getInstillCatalogAPIClient({ accessToken });
      const file = await client.catalog.getFileDetails({
        ownerId: namespaceId,
        catalogId,
        fileId: fileUid,
      });

      return file;
    },
    enabled,
  });
}
