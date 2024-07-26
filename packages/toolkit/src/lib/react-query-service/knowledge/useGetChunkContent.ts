
import { useQuery } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import { getInstillAPIClient } from "../../vdp-sdk";

export function useGetChunkContent() {
  return useQuery({
    queryKey: ["chunkContent"],
    queryFn: async ({ ownerId, kbId, chunkUid, accessToken }: { ownerId: string, kbId: string, chunkUid: string, accessToken: Nullable<string> }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillAPIClient({ accessToken });

      const response = await client.vdp.artifact.getChunkContent({ ownerId, kbId, chunkUid });

      return Promise.resolve(response.content);
    },
  });
}
