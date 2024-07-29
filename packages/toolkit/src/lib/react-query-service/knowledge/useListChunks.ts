import { useQuery } from "@tanstack/react-query";
import { getInstillArtifactAPIClient, Nullable } from "@instill-ai/toolkit";

export function useListChunks() {
  return useQuery<
    any,
    Error,
    any,
    [string, { ownerId: string; kbId: string; fileUid: string; accessToken: Nullable<string> }]
  >({
    queryKey: ["chunks"],
    queryFn: async ({ queryKey }) => {
      const [, { ownerId, kbId, fileUid, accessToken }] = queryKey;
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }
      const client = getInstillArtifactAPIClient({ accessToken });
      const response = await client.vdp.artifact.listChunks({ ownerId, kbId, fileUid });
      return response.chunks;
    },
  });
}
