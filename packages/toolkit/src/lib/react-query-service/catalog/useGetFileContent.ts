import { getInstillCatalogAPIClient, useQuery } from "@instill-ai/toolkit";
import { Nullable } from "instill-sdk";

export function useGetFileContent({
  fileUid,
  accessToken,
  enabled,
  catalogId,
  ownerId,
}: {
  fileUid: string;
  accessToken: Nullable<string>;
  enabled: boolean;
  catalogId: string;
  ownerId: string;
}) {
  return useQuery<string>({
    queryKey: ["fileContent", fileUid],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }

      const client = getInstillCatalogAPIClient({ accessToken });
      const fileContent = await client.catalog.getFileContent({
        ownerId,
        catalogId,
        fileUid,
      });

      return Promise.resolve(fileContent.content);
    },
    enabled: enabled && Boolean(accessToken),
  });
}