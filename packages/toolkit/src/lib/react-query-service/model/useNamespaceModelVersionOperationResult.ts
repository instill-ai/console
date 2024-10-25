"use client";

import type { Nullable, ResourceView } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { getInstillModelAPIClient } from "../../vdp-sdk";
import { queryKeyStore } from "../queryKeyStore";

export function useNamespaceModelVersionOperationResult({
  namespaceId,
  modelId,
  versionId,
  accessToken,
  enabled,
  view = "VIEW_BASIC",
  requesterUid,
}: {
  namespaceId: Nullable<string>;
  modelId: Nullable<string>;
  versionId: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  view: Nullable<ResourceView>;
  requesterUid: Nullable<string>;
}) {
  let enableQuery = false;

  if (namespaceId && modelId && versionId && enabled) {
    enableQuery = true;
  }

  return useQuery({
    queryKey:
      queryKeyStore.model.getUseNamespaceModelVersionOperationResultQueryKey({
        namespaceId,
        modelId,
        versionId,
        requesterUid,
        view,
      }),
    queryFn: async () => {
      if (!namespaceId) {
        return Promise.reject(new Error("Namespace id not provided"));
      }

      if (!modelId) {
        return Promise.reject(new Error("Model id not provided"));
      }

      if (!versionId) {
        return Promise.reject(new Error("Version id not provided"));
      }

      const client = getInstillModelAPIClient({
        accessToken: accessToken ?? undefined,
      });

      const operation =
        await client.model.getNamespaceModelVersionOperationResult({
          namespaceId,
          modelId,
          versionId,
          view: view ?? undefined,
          requesterUid: requesterUid ?? undefined,
        });

      return Promise.resolve(operation);
    },
    enabled: enableQuery,
  });
}
