import type { Nullable } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { createInstillAxiosClient } from "../../sdk-helper";

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
      const client = createInstillAxiosClient(accessToken, true);
      const response = await client.get<{ sourceFile: { content: string } }>(
        `/namespaces/${ownerId}/catalogs/${catalogId}/files/${fileUid}/source`,
      );
      return response.data.sourceFile.content;
    },
    enabled,
  });
}
