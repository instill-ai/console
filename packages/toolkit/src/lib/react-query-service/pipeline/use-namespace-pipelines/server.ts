import type { Nullable, ResourceView, Visibility } from "instill-sdk";

import { env, QueryClient } from "../../../../server";
import { getInstillAPIClient } from "../../../sdk-helper";
import { queryKeyStore } from "../../queryKeyStore";

export async function fetchNamespacePipelines({
  namespaceId,
  accessToken,
  filter,
  visibility,
  pageSize,
  view,
}: {
  namespaceId: Nullable<string>;
  accessToken: Nullable<string>;
  filter: Nullable<string>;
  visibility: Nullable<Visibility>;
  pageSize?: number;
  view: Nullable<ResourceView>;
}) {
  if (!namespaceId) {
    throw new Error("namespaceId is required");
  }

  try {
    const client = getInstillAPIClient({
      accessToken: accessToken ?? undefined,
    });

    const pipelines = await client.pipeline.pipeline.listNamespacePipelines({
      namespaceId,
      pageSize: pageSize ?? env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
      enablePagination: false,
      filter: filter ?? undefined,
      visibility: visibility ?? undefined,
      view: view ?? "VIEW_FULL",
    });

    return Promise.resolve(pipelines);
  } catch (error) {
    return Promise.reject(error);
  }
}

export function prefetchNamespacePipelines({
  namespaceId,
  accessToken,
  filter,
  visibility,
  queryClient,
  view,
}: {
  namespaceId: Nullable<string>;
  accessToken: Nullable<string>;
  queryClient: QueryClient;
  filter: Nullable<string>;
  visibility: Nullable<Visibility>;
  view: Nullable<ResourceView>;
}) {
  return queryClient.prefetchQuery({
    queryKey: queryKeyStore.pipeline.getUseNamespacePipelinesQueryKey({
      namespaceId,
      view,
      filter,
      visibility,
    }),
    queryFn: async () => {
      return await fetchNamespacePipelines({
        namespaceId,
        accessToken,
        filter,
        visibility,
        view,
      });
    },
  });
}
