import { useQuery } from "@tanstack/react-query";
import { createInstillAxiosClient } from "../../vdp-sdk/helper";
import { SourceFile } from "../../vdp-sdk/knowledge/types";
import { Nullable } from "@instill-ai/toolkit";

export function useGetSourceFile({
  ownerId,
  kbId,
  fileUid,
  accessToken,
}: {
  ownerId: string;
  kbId: string;
  fileUid: string;
  accessToken: Nullable<string>;
}) {
  return useQuery({
    queryKey: ['sourceFile', ownerId, kbId, fileUid],
    queryFn: async () => {
      if (!accessToken) throw new Error("accessToken not provided");
      const client = createInstillAxiosClient(accessToken, true);
      const response = await client.get<{ sourceFile: SourceFile }>(`/namespaces/${ownerId}/knowledge-bases/${kbId}/files/${fileUid}/source`);
      return response.data.sourceFile;
    },
  });
}