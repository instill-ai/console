"use client";

import type { Nullable } from "instill-sdk";
import { QueryClient } from "@tanstack/react-query";

import { getInstillModelAPIClient } from "../../../vdp-sdk";

export async function fetchNamespaceModel({
  namespaceId,
  modelId,
  accessToken,
}: {
  namespaceId: Nullable<string>;
  modelId: Nullable<string>;
  accessToken: Nullable<string>;
}) {
  try {
    if (!namespaceId) {
      return Promise.reject(new Error("namespaceId is not provided"));
    }

    if (!modelId) {
      return Promise.reject(new Error("modelId is not provided"));
    }

    const client = getInstillModelAPIClient({
      accessToken: accessToken ?? undefined,
    });

    const model = await client.model.getNamespaceModel({
      namespaceId,
      modelId,
    });

    return Promise.resolve(model);
  } catch (error) {
    return Promise.reject(error);
  }
}

export function getUseNamespaceModelQueryKey(
  namespaceId: Nullable<string>,
  modelId: Nullable<string>,
) {
  return [namespaceId, "models", modelId];
}

export function prefetchNamespaceModel({
  namespaceId,
  modelId,
  accessToken,
  queryClient,
}: {
  namespaceId: Nullable<string>;
  modelId: Nullable<string>;
  accessToken: Nullable<string>;
  queryClient: QueryClient;
}) {
  const queryKey = getUseNamespaceModelQueryKey(namespaceId, modelId);

  return queryClient.prefetchQuery({
    queryKey,
    queryFn: async () => {
      return await fetchNamespaceModel({
        namespaceId,
        modelId,
        accessToken,
      });
    },
  });
}
