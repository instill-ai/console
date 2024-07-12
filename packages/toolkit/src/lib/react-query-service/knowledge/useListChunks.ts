import { useQuery } from "@tanstack/react-query";
import { createInstillAxiosClient } from "../../vdp-sdk/helper";
import { Nullable } from "@instill-ai/toolkit";
import { File } from "../../vdp-sdk/knowledge/types";

export function useListChunks({
  kbId,
  accessToken,
  enabled,
  ownerId,
}: {
  kbId: string;
  accessToken: Nullable<string>;
  enabled: boolean;
  ownerId: string;
}) {
  return useQuery({
    queryKey: ["chunks", kbId],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }
      const client = createInstillAxiosClient(accessToken, true);
      const response = await client.get(
        `/owners/${ownerId}/knowledge-bases/${kbId}/chunks`
      );
      return response.data.chunks;
    },
    enabled,
  });
}

