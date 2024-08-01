import { useQuery } from "@tanstack/react-query";

import { Nullable } from "@instill-ai/toolkit";

import { getInstillAPIClient } from "../../vdp-sdk";
import { File } from "./types";

export function useGetFileDetails({
  ownerId,
  kbId,
  fileUid,
  accessToken,
  enabled,
}: {
  ownerId: string;
  kbId: string;
  fileUid: string;
  accessToken: Nullable<string>;
  enabled: boolean;
}) {
  return useQuery<File>({
    queryKey: ["fileDetails", ownerId, kbId, fileUid],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }
      const client = getInstillAPIClient({ accessToken });
      const file = await client.vdp.artifact.getFileDetails({
        ownerId,
        kbId,
        fileUid,
      });
      return file;
    },
    enabled,
  });
}
