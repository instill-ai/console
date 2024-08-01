import { useQuery } from "@tanstack/react-query";

import { Nullable } from "@instill-ai/toolkit";

import { getInstillAPIClient } from "../../vdp-sdk";
import { Chunk } from "./types";

export function useGetAllChunks({
  accessToken,
  ownerName,
  kbId,
  fileUid,
  enabled,
}: {
  accessToken: Nullable<string>;
  ownerName: string;
  kbId: string;
  fileUid: string;
  enabled: boolean;
}) {
  return useQuery<Chunk[]>({
    queryKey: ["allChunks", ownerName, kbId, fileUid],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }
      const client = getInstillAPIClient({ accessToken });
      const response = await client.vdp.artifact.listChunks({
        ownerId: ownerName,
        kbId,
        fileUid,
      });
      return response.chunks;
    },
    enabled,
  });
}
