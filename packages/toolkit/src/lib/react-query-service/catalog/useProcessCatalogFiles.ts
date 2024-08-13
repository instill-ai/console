import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getInstillAdditionalHeaders } from "instill-sdk";

import { Nullable } from "../../type";
import { createInstillAxiosClient } from "../../vdp-sdk/helper";
import { File } from "./types";

export function useProcessCatalogFiles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      fileUids,
      accessToken,
      namespaceUid,
    }: {
      fileUids: string[];
      accessToken: Nullable<string>;
      namespaceUid: Nullable<string>;
    }): Promise<File[]> => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }
      if (!namespaceUid) {
        return Promise.reject(new Error("namespaceUid not provided"));
      }

      const client = createInstillAxiosClient(accessToken, true);

      const additionalHeaders = getInstillAdditionalHeaders({
        requesterUid: namespaceUid,
      });

      const response = await client.post<{ files: File[] }>(
        `/catalogs/files/processAsync`,
        { file_uids: fileUids },
        {
          headers: additionalHeaders,
        },
      );

      return response.data.files;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalogFiles"] });
    },
  });
}
