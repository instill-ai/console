import { useQuery } from "@tanstack/react-query";

import { Nullable } from "@instill-ai/toolkit";

import { createInstillAxiosClient } from "../../vdp-sdk/helper";
import { File } from "./types";

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
        `/namespaces/${ownerId}/catalogs/${kbId}/files/${fileUid}`,
      );
      return response.data.file;
    },
    enabled,
  });
}
