import { useQuery } from "@tanstack/react-query";
import { getInstillAPIClient, Nullable } from "@instill-ai/toolkit";

export function useGetFileDetails() {
  return useQuery({
    queryKey: ["fileDetails"],
    queryFn: async ({ ownerId, kbId, fileUid, accessToken }: { ownerId: string, kbId: string, fileUid: string, accessToken: Nullable<string> }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillAPIClient({ accessToken });

      const response = await client.vdp.knowledgeBase.getFileDetails({ ownerId, kbId, fileUid });

      return Promise.resolve(response.file);
    },
  });
}
