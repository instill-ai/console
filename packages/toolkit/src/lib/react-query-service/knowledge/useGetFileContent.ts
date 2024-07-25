
import { useQuery } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import { getInstillAPIClient } from "../../vdp-sdk";

export function useGetFileContent() {
  return useQuery({
    queryKey: ["fileContent"],
    queryFn: async ({ ownerId, kbId, fileUid, accessToken }: { ownerId: string, kbId: string, fileUid: string, accessToken: Nullable<string> }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillAPIClient({ accessToken });

      const response = await client.vdp.knowledgeBase.getFileContent({ ownerId, kbId, fileUid });

      return Promise.resolve(response.content);
    },
  });
}