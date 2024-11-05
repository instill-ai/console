"use client";

import type { Nullable, ResourceView } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { fetchNamespaceModel, getUseNamespaceModelQueryKey } from "./server";

export function useNamespaceModel({
  namespaceId,
  modelId,
  accessToken,
  enabled,
  view,
}: {
  namespaceId: Nullable<string>;
  modelId: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  view: Nullable<ResourceView>;
}) {
  let enableQuery = false;

  if (namespaceId && modelId && enabled) {
    enableQuery = true;
  }

  return useQuery({
    queryKey: getUseNamespaceModelQueryKey(namespaceId, modelId, view),
    queryFn: async () => {
      return await fetchNamespaceModel({
        namespaceId,
        modelId,
        accessToken,
        view,
      });
    },
    enabled: enableQuery,
  });
}
