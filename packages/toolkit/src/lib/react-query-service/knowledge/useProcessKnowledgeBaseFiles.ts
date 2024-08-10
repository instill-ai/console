import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Nullable } from "../../type";
import { createInstillAxiosClient } from "../../vdp-sdk/helper";
import { File } from "./types";
import { getInstillAdditionalHeaders } from "instill-sdk";

export function useProcessKnowledgeBaseFiles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      fileUids,
      accessToken,
      namespace,
    }: {
      fileUids: string[];
      accessToken: Nullable<string>;
      namespace: Nullable<string>;
    }): Promise<File[]> => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }
      if (!namespace) {
        return Promise.reject(new Error("namespace not provided"));
      }

      const client = createInstillAxiosClient(accessToken, true);

      const additionalHeaders = getInstillAdditionalHeaders({
        requesterUid: namespace,
      });

      const response = await client.post<{ files: File[] }>(
        `/catalogs/files/processAsync`,
        { file_uids: fileUids },
        {
          headers: additionalHeaders,
        }
      );

      return response.data.files;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledgeBaseFiles"] });
    },
  });
}