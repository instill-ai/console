import { useQuery } from "@tanstack/react-query";
import { createInstillAxiosClient } from "../../vdp-sdk/helper";
import { Nullable } from "@instill-ai/toolkit";

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
  return useQuery({
    queryKey: ["chunks", kbId, fileUid],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }
      const client = createInstillAxiosClient(accessToken, true);
      try {
        const response = await client.get(
          `/namespaces/${ownerId}/knowledge-bases/${kbId}/chunks`,
          {
            params: { fileUid },
          }
        );
        return response.data.chunks;
      } catch (error) {
        console.error("Error fetching chunks:", error);
        throw new Error("Failed to fetch chunks. Please try again later.");
      }
    },
    enabled: enabled && !!fileUid,
  });
}
