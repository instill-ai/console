"use client";

import type { Nullable } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { fetchNamespaceModel, getUseNamespaceModelQueryKey } from "./server";

export function useNamespaceModel({
  namespaceId,
  modelId,
  accessToken,
  enabled,
}: {
  namespaceId: Nullable<string>;
  modelId: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
}) {
  let enableQuery = false;

  if (namespaceId && modelId && enabled) {
    enableQuery = true;
  }

  return useQuery({
    queryKey: getUseNamespaceModelQueryKey(namespaceId, modelId),
    queryFn: async () => {
      return await fetchNamespaceModel({
        namespaceId,
        modelId,
        accessToken,
      });
    },
    enabled: enableQuery,
  });
}
