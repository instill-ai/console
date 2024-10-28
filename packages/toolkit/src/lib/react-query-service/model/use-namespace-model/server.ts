"use client";

import type { Nullable, ResourceView } from "instill-sdk";
import { QueryClient } from "@tanstack/react-query";

import { getInstillModelAPIClient } from "../../../sdk-helper";

export async function fetchNamespaceModel({
  namespaceId,
  modelId,
  accessToken,
  view,
}: {
  namespaceId: Nullable<string>;
  modelId: Nullable<string>;
  accessToken: Nullable<string>;
  view: Nullable<ResourceView>;
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
      view: view ?? undefined,
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
  view,
}: {
  namespaceId: Nullable<string>;
  modelId: Nullable<string>;
  accessToken: Nullable<string>;
  queryClient: QueryClient;
  view: Nullable<ResourceView>;
}) {
  const queryKey = getUseNamespaceModelQueryKey(namespaceId, modelId);

  return queryClient.prefetchQuery({
    queryKey,
    queryFn: async () => {
      return await fetchNamespaceModel({
        namespaceId,
        modelId,
        accessToken,
        view,
      });
    },
  });
}
