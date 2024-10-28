"use client";

import type { Nullable, Visibility } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { queryKeyStore } from "../../queryKeyStore";
import { fetchNamespaceModels } from "./server";

export function useNamespaceModels({
  namespaceId,
  enabled,
  accessToken,
  filter,
  visibility,
}: {
  namespaceId: Nullable<string>;
  enabled: boolean;
  accessToken: Nullable<string>;
  filter: Nullable<string>;
  visibility: Nullable<Visibility>;
}) {
  let enableQuery = false;

  if (namespaceId && enabled) {
    enableQuery = true;
  }

  return useQuery({
    queryKey: queryKeyStore.model.getNamespaceModelsQueryKey({
      namespaceId,
      filter,
      visibility,
    }),
    queryFn: async () => {
      if (!namespaceId) {
        return Promise.reject(new Error("namespaceId not provided"));
      }

      const models = await fetchNamespaceModels({
        namespaceId,
        accessToken,
        filter,
        visibility,
      });
      return Promise.resolve(models);
    },
    enabled: enableQuery,
  });
}
