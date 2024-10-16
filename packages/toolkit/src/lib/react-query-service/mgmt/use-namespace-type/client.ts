"use client";

import { useQuery } from "@tanstack/react-query";

import type { Nullable } from "../../../type";
import { fetchNamespaceType, getUseNamespaceTypeQueryKey } from "./server";

export function useNamespaceType({
  namespace,
  accessToken,
  enabled,
}: {
  namespace: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
}) {
  let enabledQuery = false;

  if (namespace && enabled) {
    enabledQuery = true;
  }

  const queryKey = getUseNamespaceTypeQueryKey(namespace);

  return useQuery({
    queryKey,
    queryFn: async () => {
      return fetchNamespaceType({
        namespace,
        accessToken,
      });
    },
    enabled: enabledQuery,
  });
}
