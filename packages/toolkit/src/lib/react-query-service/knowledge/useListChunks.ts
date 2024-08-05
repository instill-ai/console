import { useQuery } from "@tanstack/react-query";

import { Nullable } from "../../type";
import { createInstillAxiosClient } from "../../vdp-sdk/helper";

export function useListChunks({
  catalogId,
  accessToken,
  enabled,
  ownerId,
  fileUid,
}: {
  catalogId: string;
  accessToken: Nullable<string>;
  enabled: boolean;
  ownerId: string;
  fileUid: string;
}) {
  return useQuery({
    queryKey: ["chunks", catalogId, fileUid],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }
      const client = createInstillAxiosClient(accessToken, true);
      try {
        const response = await client.get(
          `/namespaces/${catalogId}/catalogs/${ownerId}/chunks`,
          {
            params: { fileUid },
          },
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
