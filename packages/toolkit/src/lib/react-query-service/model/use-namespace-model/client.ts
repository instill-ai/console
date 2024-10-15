"use client";

import type { Nullable } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { fetchNamespaceModel, getUseNamespaceModelQueryKey } from "./server";

export function useNamespaceModel({
  namespaceModelName,
  accessToken,
  enabled,
}: {
  namespaceModelName: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
}) {
  let enableQuery = false;

  if (namespaceModelName && enabled) {
    enableQuery = true;
  }

  return useQuery({
    queryKey: getUseNamespaceModelQueryKey(namespaceModelName),
    queryFn: async () => {
      return await fetchNamespaceModel({
        namespaceModelName,
        accessToken,
      });
    },
    enabled: enableQuery,
  });
}
