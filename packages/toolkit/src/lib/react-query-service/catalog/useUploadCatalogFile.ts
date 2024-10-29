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
      if (!namespaceId) {
        throw new Error("namespaceId not provided");
      }
      if (!catalogId) {
        throw new Error("catalogId not provided");
      }
      if (!payload) {
        throw new Error("payload must be provided");
      }
      if (!payload.name) {
        throw new Error("payload.name is required");
      }
      if (!payload.type) {
        throw new Error("payload.type is required");
      }
      if (!payload.content) {
        throw new Error("payload.content is required");
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
