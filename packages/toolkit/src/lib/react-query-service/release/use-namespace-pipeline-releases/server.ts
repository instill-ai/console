import type { Nullable, ResourceView } from "instill-sdk";

import { env, QueryClient } from "../../../../server";
import { getInstillAPIClient } from "../../../sdk-helper";
import { queryKeyStore } from "../../queryKeyStore";

export async function fetchNamespacePipelineReleases({
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

    const pipelineReleases =
      await client.vdp.release.listNamespacePipelineReleases({
        namespaceId,
        pipelineId,
        pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
        shareCode: shareCode ?? undefined,
        enablePagination: false,
        view: view ?? "VIEW_BASIC",
      });

    return Promise.resolve(pipelineReleases);
  } catch (error) {
    return Promise.reject(error);
  }
}

export function prefetchNamespacePipelineReleases({
  namespaceId,
  pipelineId,
  accessToken,
  queryClient,
  shareCode,
  view,
}: {
  queryClient: QueryClient;
  namespaceId: Nullable<string>;
  pipelineId: Nullable<string>;
  accessToken: Nullable<string>;
  shareCode: Nullable<string>;
  view: Nullable<ResourceView>;
}) {
  return queryClient.prefetchQuery({
    queryKey: queryKeyStore.release.getUseNamespacePipelineReleasesQueryKey({
      namespaceId,
      pipelineId,
      view,
      shareCode,
    }),
    queryFn: async () => {
      return await fetchNamespacePipelineReleases({
        namespaceId,
        pipelineId,
        accessToken,
        shareCode,
        view,
      });
    },
  });
}
