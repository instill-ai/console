import { useQuery } from "@tanstack/react-query";

import { Nullable } from "@instill-ai/toolkit";

import { getInstillAPIClient } from "../../vdp-sdk";
import { Chunk } from "./types";

export function useListChunks({
  kbId,
  accessToken,
  enabled,
  ownerId,
  fileUid,
}: {
  kbId: string;
  accessToken: Nullable<string>;
  enabled: boolean;
  ownerId: string;
  fileUid: string;
}) {
  return useQuery<Chunk[]>({
    queryKey: ["chunks", kbId, fileUid],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }
      const client = getInstillAPIClient({ accessToken });
      const response = await client.vdp.artifact.listChunks({
        ownerId,
        kbId,
        fileUid,
      });
      return response.chunks;
    },
    enabled: enabled && !!fileUid,
  });
}
