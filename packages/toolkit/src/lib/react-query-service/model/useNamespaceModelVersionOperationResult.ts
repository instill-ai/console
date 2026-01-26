"use client";

import type { Nullable, ResourceView } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { getInstillModelAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useNamespaceModelVersionOperationResult({
  namespaceId,
  modelId,
  versionId,
  accessToken,
  enabled,
  view = "VIEW_BASIC",
  requesterId,
}: {
  namespaceId: Nullable<string>;
  modelId: Nullable<string>;
  versionId: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  view: Nullable<ResourceView>;
  requesterId: Nullable<string>;
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
        requesterId,
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
          requesterId: requesterId ?? undefined,
        });

      return Promise.resolve(operation);
    },
    enabled: enableQuery,
  });
}
