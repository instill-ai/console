import { useQuery } from "@tanstack/react-query";

import { Nullable } from "@instill-ai/toolkit";

import { getInstillAPIClient } from "../../vdp-sdk";

export function useGetFileContent({
  ownerId,
  kbId,
  fileUid,
  accessToken,
  enabled,
}: {
  ownerId: string;
  kbId: string;
  fileUid: string;
  accessToken: Nullable<string>;
  enabled: boolean;
}) {
  return useQuery<string>({
    queryKey: ["fileContent", ownerId, kbId, fileUid],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }
      const client = getInstillAPIClient({ accessToken });
      const content = await client.vdp.artifact.getFileContent({
        ownerId,
        kbId,
        fileUid,
      });
      return content;
    },
    enabled,
  });
}
