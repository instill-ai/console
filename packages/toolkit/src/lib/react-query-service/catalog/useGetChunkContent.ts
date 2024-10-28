import type { Nullable } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { createInstillAxiosClient } from "../../sdk-helper";

//Unused for now, might be removed later
export function useGetChunkContent({
  chunkUid,
  accessToken,
  enabled,
  catalogId,
  ownerId,
}: {
  chunkUid: string;
  accessToken: Nullable<string>;
  enabled: boolean;
  catalogId: string;
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
          `/namespaces/${ownerId}/knowledge-bases/${catalogId}/chunks/${chunkUid}/content`,
        );
        return response.data.content;
      } catch (error) {
        console.error("Error fetching chunk content:", error);
        throw new Error(
          "Failed to fetch chunk content. Please try again later.",
        );
      }
    },
    enabled,
  });
}
