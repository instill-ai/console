import { useQuery } from "@tanstack/react-query";
import { Nullable } from "instill-sdk";

import { getInstillCatalogAPIClient } from "../../sdk-helper";

export function useGetFileContent({
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
  return useQuery<string>({
    queryKey: ["fileContent", fileUid],
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
      const fileContent = await client.catalog.getFileContent({
        namespaceId,
        catalogId,
        fileUid,
      });

      return Promise.resolve(fileContent.content);
    },
    enabled: enabled && Boolean(accessToken) && Boolean(fileUid),
  });
}
