import { getInstillCatalogAPIClient, useQuery } from "@instill-ai/toolkit";
import { CatalogFile, Nullable } from "instill-sdk";

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