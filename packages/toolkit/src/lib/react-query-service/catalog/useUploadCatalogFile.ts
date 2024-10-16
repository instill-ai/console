import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Nullable } from "../../type";
import { createInstillAxiosClient } from "../../vdp-sdk/helper";
import { File } from "./types";

export function useUploadCatalogFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ownerId,
      catalogId,
      payload,
      accessToken,
    }: {
      ownerId: Nullable<string>;
      catalogId: string;
      payload: {
        name: string;
        type: string;
        content: string;
      };
      accessToken: Nullable<string>;
    }): Promise<File> => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }
      const client = createInstillAxiosClient(accessToken, true);
      const response = await client.post<{ file: File }>(
        `/namespaces/${ownerId}/catalogs/${catalogId}/files`,
        payload,
      );
      return response.data.file;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalogFiles"] });
    },
  });
}
