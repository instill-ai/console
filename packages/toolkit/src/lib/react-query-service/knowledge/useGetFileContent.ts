import { Nullable } from "@instill-ai/design-system";
import { useQuery } from "@tanstack/react-query";
import { createInstillAxiosClient } from "../../vdp-sdk";

export function useGetFileContent({
  fileUid,
  accessToken,
  enabled,
  kbId,
}: {
  fileUid: string;
  accessToken: Nullable<string>;
  enabled: boolean;
  kbId: string;
}) {
  return useQuery<string>({
    queryKey: ["fileContent", fileUid],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }
      const client = createInstillAxiosClient(accessToken, true);
      const response = await client.get<{ content: string }>(
        `/owners/{ownerId}/knowledge-bases/${kbId}/files/${fileUid}/source`
      );
      return response.data.content;
    },
    enabled,
  });
}
