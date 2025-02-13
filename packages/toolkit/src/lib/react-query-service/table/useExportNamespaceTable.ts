"use client";

import type { ExportNamespaceTableRequest, Nullable } from "instill-sdk";
import { useMutation } from "@tanstack/react-query";

import { getInstillCatalogAPIClient } from "../../sdk-helper";

export function useExportNamespaceTable() {
  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: ExportNamespaceTableRequest;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        throw new Error("accessToken is required");
      }

      if (!payload.namespaceId) {
        throw new Error("namespaceId is required");
      }

      if (!payload.tableUid) {
        throw new Error("tableUid is required");
      }

      const client = getInstillCatalogAPIClient({ accessToken });
      await client.table.exportNamespaceTable(payload);
    },
  });
}
