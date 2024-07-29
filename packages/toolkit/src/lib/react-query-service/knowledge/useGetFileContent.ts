
import { useQuery } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import { getInstillArtifactAPIClient } from "../../vdp-sdk";

export function useGetFileContent() {
  return useQuery<
    any,
    Error,
    any,
    [string, { ownerId: string; kbId: string; fileUid: string; accessToken: Nullable<string> }]
  >({
    queryKey: ["fileContent"],
    queryFn: async ({ queryKey }) => {
      const [, { ownerId, kbId, fileUid, accessToken }] = queryKey;
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }
      const client = getInstillArtifactAPIClient({ accessToken });
      const response = await client.vdp.artifact.getFileContent({ ownerId, kbId, fileUid });
      return response.content;
    },
  });
}