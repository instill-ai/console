
import { useQuery } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import { getInstillArtifactAPIClient } from "../../vdp-sdk";

export function useGetChunkContent() {
  return useQuery<
    string,
    Error,
    string,
    [string, { ownerId: string; kbId: string; chunkUid: string; accessToken: Nullable<string> }]
  >({
    queryKey: ["chunkContent"],
    queryFn: async ({ queryKey }) => {
      const [, { ownerId, kbId, chunkUid, accessToken }] = queryKey;
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }
      const client = getInstillArtifactAPIClient({ accessToken });
      const response = await client.artifact.getChunkContent({ ownerId, kbId, chunkUid });
      return response;
    },
  });
}