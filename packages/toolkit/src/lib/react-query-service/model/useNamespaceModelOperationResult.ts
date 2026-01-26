"use client";

import type { Nullable, ResourceView } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { getInstillModelAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useNamespaceModelOperationResult({
  namespaceId,
  modelId,
  accessToken,
  enabled,
  view = "VIEW_BASIC",
  requesterId,
}: {
  namespaceId: Nullable<string>;
  modelId: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  view: Nullable<ResourceView>;
  requesterId: Nullable<string>;
}) {
  let enableQuery = false;

  if (namespaceId && modelId && enabled) {
    enableQuery = true;
  }

  return useQuery({
    queryKey: queryKeyStore.model.getUseNamespaceModelOperationResultQueryKey({
      namespaceId,
      modelId,
      requesterId,
      view,
    }),
    queryFn: async () => {
      if (!namespaceId) {
        return Promise.reject(new Error("namespaceId not provided"));
      }

      if (!modelId) {
        return Promise.reject(new Error("modelId not provided"));
      }

      const client = getInstillModelAPIClient({
        accessToken: accessToken ?? undefined,
      });

      const operation = await client.model.getNamespaceModelOperationResult({
        namespaceId,
        modelId,
        view: view ?? undefined,
        requesterId: requesterId ?? undefined,
      });

      return Promise.resolve(operation);
    },
    enabled: enableQuery,
  });
}
