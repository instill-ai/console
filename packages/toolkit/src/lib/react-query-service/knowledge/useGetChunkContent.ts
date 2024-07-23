import { useQuery } from "@tanstack/react-query";
import { createInstillAxiosClient } from "../../vdp-sdk/helper";
import { Nullable } from "@instill-ai/toolkit";

export function useGetChunkContent({
  chunkUid,
  accessToken,
  enabled,
  kbId,
  ownerId,
}: {
  chunkUid: string;
  accessToken: Nullable<string>;
  enabled: boolean;
  kbId: string;
  ownerId: string;
}) {
  return useQuery({
    queryKey: ["chunkContent", chunkUid],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }
      const client = createInstillAxiosClient(accessToken, true);
      try {
        const response = await client.get(
          `/namespaces/${ownerId}/knowledge-bases/${kbId}/chunks/${chunkUid}/content`
        );
        return response.data.content;
      } catch (error) {
        console.error("Error fetching chunk content:", error);
        throw new Error(
          "Failed to fetch chunk content. Please try again later."
        );
      }
    },
    enabled,
  });
}
