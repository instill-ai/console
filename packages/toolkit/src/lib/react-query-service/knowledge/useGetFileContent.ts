import { useQuery } from "@tanstack/react-query";

import { Nullable } from "@instill-ai/toolkit";

import { createInstillAxiosClient } from "../../vdp-sdk/helper";

export function useGetFileContent({
  fileUid,
  accessToken,
  enabled,
  kbId,
  ownerId,
}: {
  fileUid: string;
  accessToken: Nullable<string>;
  enabled: boolean;
  kbId: string;
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
        `/namespaces/${ownerId}/catalogs/${kbId}/files/${fileUid}/source`,
      );
      return response.data.sourceFile.content;
    },
    enabled,
  });
}
