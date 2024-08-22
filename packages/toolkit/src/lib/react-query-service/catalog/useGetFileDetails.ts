import { useQuery } from "@tanstack/react-query";

import { Nullable } from "../../type";
import { createInstillAxiosClient } from "../../vdp-sdk/helper";
import { File } from "./types";

export function useGetFileDetails({
  fileUid,
  accessToken,
  enabled,
  catalogId,
  ownerId,
}: {
  fileUid: string;
  accessToken: Nullable<string>;
  enabled: boolean;
  catalogId: string;
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
        `/namespaces/${ownerId}/catalogs/${catalogId}/files/${fileUid}`,
      );
      return response.data.file;
    },
    enabled,
  });
}
