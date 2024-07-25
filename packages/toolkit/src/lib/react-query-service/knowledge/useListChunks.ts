import { useQuery } from "@tanstack/react-query";
import { getInstillArtifactAPIClient, Nullable } from "@instill-ai/toolkit";

export function useListChunks() {
  return useQuery({
    queryKey: ["chunks"],
    queryFn: async ({ ownerId, kbId, fileUid, accessToken }: { ownerId: string, kbId: string, fileUid: string, accessToken: Nullable<string> }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillArtifactAPIClient({ accessToken });

      const response = await client.vdp.knowledgeBase.listChunks({ ownerId, kbId, fileUid });

      return Promise.resolve(response.chunks);
    },
  });
}
