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
      if (!fileUid) {
        throw new Error("fileUid not provided");
      }
      if (!catalogId) {
        throw new Error("catalogId not provided");
      }
      if (!namespaceId) {
        throw new Error("namespaceId not provided");
      }

      const client = getInstillCatalogAPIClient({ accessToken });
      const file = await client.catalog.getFileDetails({
        namespaceId,
        catalogId,
        fileId: fileUid,
      });

      return file;
    },
    enabled: enabled && Boolean(accessToken) && Boolean(fileUid),
  });
}
