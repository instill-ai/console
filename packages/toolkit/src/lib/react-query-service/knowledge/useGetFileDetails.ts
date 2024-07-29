import { useQuery } from "@tanstack/react-query";
import { getInstillAPIClient, Nullable } from "@instill-ai/toolkit";

export function useGetFileDetails() {
  return useQuery<
    any,
    Error,
    any,
    [string, { ownerId: string; kbId: string; fileUid: string; accessToken: Nullable<string> }]
  >({
    queryKey: ["fileDetails"],
    queryFn: async ({ queryKey }) => {
      const [, { ownerId, kbId, fileUid, accessToken }] = queryKey;
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }
      const client = getInstillAPIClient({ accessToken });
      const response = await client.vdp.artifact.getFileDetails({ ownerId, kbId, fileUid });
      return response.file;
    },
  });
}
