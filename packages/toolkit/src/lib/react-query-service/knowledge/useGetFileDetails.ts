import { useQuery } from "@tanstack/react-query";

import { Nullable } from "@instill-ai/toolkit";

import { File } from "../../../../../sdk/src/knowledge/types";
import { createInstillAxiosClient } from "../../vdp-sdk/helper";

export function useGetFileDetails({
  fileUid,
  accessToken,
  enabled,
  kbId,
  ownerId,
}: {
  fileUid: string;
  accessToken: Nullable<string>;
  enabled: boolean;
  kbId: string;
  ownerId: string;
}) {
  return useQuery<File>({
    queryKey: ["fileDetails", fileUid],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }
      const client = createInstillAxiosClient(accessToken, true);
      const response = await client.get<{ file: File }>(
        `/namespaces/${ownerId}/knowledge-bases/${kbId}/files/${fileUid}`,
      );
      return response.data.file;
    },
    enabled,
  });
}
