"use client";

import type { CatalogFile, Nullable } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillCatalogAPIClient } from "../../sdk-helper";

export function useProcessCatalogFiles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      fileUids,
      accessToken,
      requesterUid,
    }: {
      fileUids: string[];
      accessToken: Nullable<string>;
      requesterUid: Nullable<string>;
    }): Promise<CatalogFile[]> => {
      if (!accessToken) {
        throw new Error("accessToken is required");
      }

      if (!requesterUid) {
        throw new Error("requesterUid is required");
      }

      if (!fileUids) {
        throw new Error("fileUids is required");
      }

      if (fileUids.length === 0) {
        throw new Error("fileUids must be a non-empty array");
      }

      const client = getInstillCatalogAPIClient({ accessToken });
      const files = await client.catalog.processCatalogFiles({
        fileUids,
        requesterUid,
      });

      return Promise.resolve(files);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalogFiles"] });
    },
  });
}
