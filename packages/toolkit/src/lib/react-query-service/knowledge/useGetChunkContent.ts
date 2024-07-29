
import { useQuery } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import { getInstillAPIClient } from "../../vdp-sdk";

export function useGetChunkContent() {
  return useQuery<
    any,
    Error,
    any,
    [string, { ownerId: string; kbId: string; chunkUid: string; accessToken: Nullable<string> }]
  >({
    queryKey: ["chunkContent"],
    queryFn: async ({ queryKey }) => {
      const [, { ownerId, kbId, chunkUid, accessToken }] = queryKey;
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }
      const client = getInstillAPIClient({ accessToken });
      const response = await client.vdp.artifact.getChunkContent({ ownerId, kbId, chunkUid });
      return response.content;
    },
  });
}