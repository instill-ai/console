import type { Nullable, Visibility } from "instill-sdk";

import { env, QueryClient } from "../../../../server";
import { getInstillModelAPIClient } from "../../../sdk-helper";
import { queryKeyStore } from "../../queryKeyStore";

export async function fetchNamespaceModels({
  namespaceId,
  accessToken,
  filter,
  visibility,
}: {
  namespaceId: Nullable<string>;
  accessToken: Nullable<string>;
  filter: Nullable<string>;
  visibility: Nullable<Visibility>;
}) {
  try {
    if (!namespaceId) {
      throw new Error("namespaceId not provided");
    }

    const client = getInstillModelAPIClient({
      accessToken: accessToken ?? undefined,
    });

    const models = await client.model.listNamespaceModels({
      namespaceId,
      filter: filter ?? undefined,
      visibility: visibility ?? undefined,
      pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
      enablePagination: false,
    });

    return Promise.resolve(models);
  } catch (err) {
    return Promise.reject(err);
  }
}

export function prefetchNamespaceModels({
  namespaceId,
  accessToken,
  queryClient,
  filter,
  visibility,
}: {
  namespaceId: Nullable<string>;
  accessToken: Nullable<string>;
  queryClient: QueryClient;
  filter: Nullable<string>;
  visibility: Nullable<Visibility>;
}) {
  return queryClient.prefetchQuery({
    queryKey: queryKeyStore.model.getNamespaceModelsQueryKey({
      namespaceId,
      filter,
      visibility,
    }),
    queryFn: async () => {
      return await fetchNamespaceModels({
        namespaceId,
        accessToken,
        filter,
        visibility,
      });
    },
  });
}
