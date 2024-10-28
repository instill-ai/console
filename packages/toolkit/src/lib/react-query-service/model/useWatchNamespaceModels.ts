"use client";

import type { ModelsWatchState, Nullable } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { getInstillModelAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useWatchNamespaceModels({
  namespaceId,
  modelIds,
  accessToken,
  enabled,
}: {
  namespaceId: Nullable<string>;
  modelIds: string[];
  accessToken: Nullable<string>;
  enabled: boolean;
}) {
  let enableQuery = false;

  if (namespaceId && modelIds && enabled && modelIds.length > 0) {
    enableQuery = true;
  }

  return useQuery({
    queryKey: queryKeyStore.model.getUseWatchNamespaceModelsQueryKey({
      namespaceId,
      modelIds,
    }),
    queryFn: async () => {
      if (!namespaceId) {
        return Promise.reject(new Error("namespaceId not provided"));
      }

      if (!modelIds || modelIds.length === 0) {
        return Promise.reject(new Error("modelIds not provided"));
      }

      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const watches: ModelsWatchState = {};

      const client = getInstillModelAPIClient({
        accessToken: accessToken ?? undefined,
      });

      for (const modelId of modelIds) {
        try {
          const watch =
            await client.model.watchNamespaceModelLatestVersionState({
              namespaceId,
              modelId,
            });

          watches[modelId] = watch;
        } catch (error) {
          watches[modelId] = null;
        }
      }

      return Promise.resolve(watches);
    },
    enabled: enableQuery,
  });
}
