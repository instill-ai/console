import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Nullable } from "instill-sdk";

import { getInstillCatalogAPIClient } from "../../sdk-helper";

export function useUploadCatalogFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      namespaceId,
      catalogId,
      payload,
      accessToken,
    }: {
      namespaceId: string;
      catalogId: string;
      payload: {
        name: string;
        type: string;
        content: string;
      };
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }

      const client = getInstillCatalogAPIClient({ accessToken });
      const file = await client.catalog.uploadCatalogFile({
        namespaceId,
        catalogId,
        payload,
      });

      return Promise.resolve(file);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["catalogFiles", variables.namespaceId, variables.catalogId],
      });
    },
  });
}
