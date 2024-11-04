import type { Nullable, ResourceView } from "instill-sdk";
import { QueryClient } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../../sdk-helper";
import { queryKeyStore } from "../../queryKeyStore";

export async function fetchNamespacePipeline({
  namespaceId,
  pipelineId,
  accessToken,
  shareCode,
  view,
}: {
  namespaceId: Nullable<string>;
  pipelineId: Nullable<string>;
  accessToken: Nullable<string>;
  shareCode: Nullable<string>;
  view: Nullable<ResourceView>;
}) {
  if (!namespaceId) {
    throw new Error("namespaceId is required");
  }

  if (!pipelineId) {
    throw new Error("pipelineId is required");
  }

  try {
    const client = getInstillAPIClient({
      accessToken: accessToken ?? undefined,
    });

    const pipeline = await client.vdp.pipeline.getNamespacePipeline({
      namespaceId,
      pipelineId,
      shareCode: shareCode ?? undefined,
      view: view ?? "VIEW_BASIC",
    });

    return Promise.resolve(pipeline);
  } catch (error) {
    return Promise.reject(error);
  }
}

export function getUseNamespacePipelineQueryKey(
  namespaceId: Nullable<string>,
  pipelineId: Nullable<string>,
) {
  return [namespaceId, "pipelines", pipelineId];
}

export function prefetchNamespacePipeline({
  namespaceId,
  pipelineId,
  accessToken,
  queryClient,
  shareCode,
  view,
}: {
  namespaceId: Nullable<string>;
  pipelineId: Nullable<string>;
  accessToken: Nullable<string>;
  queryClient: QueryClient;
  shareCode: Nullable<string>;
  view: Nullable<ResourceView>;
}) {
  return queryClient.prefetchQuery({
    queryKey: queryKeyStore.pipeline.getUseNamespacePipelineQueryKey({
      namespaceId,
      pipelineId,
      view,
      shareCode,
    }),
    queryFn: async () => {
      return await fetchNamespacePipeline({
        namespaceId,
        pipelineId,
        accessToken,
        shareCode,
        view,
      });
    },
  });
}
