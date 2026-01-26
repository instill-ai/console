import type { Nullable } from "instill-sdk";
import { QueryClient } from "@tanstack/react-query";

import { env } from "../../../../server";
import { getInstillAPIClient } from "../../../sdk-helper";
import { queryKeyStore } from "../../queryKeyStore";

export async function fetchNamespaceSecrets({
  namespaceId,
  accessToken,
  pageSize,
}: {
  namespaceId: Nullable<string>;
  accessToken: Nullable<string>;
  pageSize?: number;
}) {
  if (!namespaceId) {
    throw new Error("namespaceId is required");
  }

  if (!accessToken) {
    throw new Error("accessToken is required");
  }

  try {
    const client = getInstillAPIClient({ accessToken });

    const userSecrets = await client.pipeline.secret.listNamespaceSecrets({
      namespaceId,
      enablePagination: false,
      pageSize: pageSize ?? env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
    });

    return Promise.resolve(userSecrets);
  } catch (error) {
    return Promise.reject(error);
  }
}

export function prefetchNamespaceSecrets({
  namespaceId,
  accessToken,
  queryClient,
}: {
  namespaceId: Nullable<string>;
  accessToken: Nullable<string>;
  queryClient: QueryClient;
}) {
  return queryClient.prefetchQuery({
    queryKey: queryKeyStore.secret.getUseNamespaceSecretsQueryKey({
      namespaceId,
    }),
    queryFn: async () => {
      return await fetchNamespaceSecrets({
        namespaceId,
        accessToken,
      });
    },
  });
}
