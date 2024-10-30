"use client";

import type { Nullable, ResourceView, Visibility } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { queryKeyStore } from "../../queryKeyStore";
import { fetchNamespacePipelines } from "./server";

// This is a public API, we won't block unauth users from accessing this

export function useNamespacePipelines({
  namespaceId,
  enabled,
  accessToken,
  filter,
  visibility,
  pageSize,
  view,
}: {
  namespaceId: Nullable<string>;
  enabled: boolean;
  accessToken: Nullable<string>;
  filter: Nullable<string>;
  visibility: Nullable<Visibility>;
  pageSize?: number;
  view: Nullable<ResourceView>;
}) {
  let enableQuery = false;

  if (namespaceId && enabled) {
    enableQuery = true;
  }

  return useQuery({
    queryKey: queryKeyStore.pipeline.getUseNamespacePipelinesQueryKey({
      namespaceId,
      view,
      filter,
      visibility,
    }),
    queryFn: async () => {
      try {
        return await fetchNamespacePipelines({
          namespaceId,
          accessToken,
          filter,
          visibility,
          pageSize,
          view,
        });
      } catch (error) {
        return Promise.reject(error);
      }
    },
    enabled: enableQuery,
  });
}
