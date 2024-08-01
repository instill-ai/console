import { useQuery } from "@tanstack/react-query";

import { Nullable } from "@instill-ai/toolkit";

import { getInstillAPIClient } from "../../vdp-sdk";

export function useGetChunkContent({
  ownerId,
  kbId,
  chunkUid,
  accessToken,
  enabled,
}: {
  ownerId: string;
  kbId: string;
  chunkUid: string;
  accessToken: Nullable<string>;
  enabled: boolean;
}) {
  return useQuery<string>({
    queryKey: ["chunkContent", ownerId, kbId, chunkUid],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }
      const client = getInstillAPIClient({ accessToken });
      const content = await client.vdp.artifact.getChunkContent({
        ownerId,
        kbId,
        chunkUid,
      });
      return content;
    },
    enabled,
  });
}
