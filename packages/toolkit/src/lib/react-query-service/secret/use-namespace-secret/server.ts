import type { Nullable } from "instill-sdk";
import { QueryClient } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../../sdk-helper";
import { queryKeyStore } from "../../queryKeyStore";

export async function fetchNamespaceSecret({
  namespaceId,
  secretId,
  accessToken,
}: {
  namespaceId: Nullable<string>;
  secretId: Nullable<string>;
  accessToken: Nullable<string>;
}) {
  if (!namespaceId) {
    throw new Error("namespaceId is required");
  }

  if (!secretId) {
    throw new Error("secretId is required");
  }

  if (!accessToken) {
    throw new Error("accessToken not provided");
  }

  try {
    const client = getInstillAPIClient({ accessToken });

    const userSecret = await client.pipeline.secret.getNamespaceSecret({
      namespaceId,
      secretId,
    });

    return Promise.resolve(userSecret);
  } catch (error) {
    return Promise.reject(error);
  }
}

export function prefetchNamespaceSecret({
  namespaceId,
  secretId,
  accessToken,
  queryClient,
}: {
  namespaceId: Nullable<string>;
  secretId: Nullable<string>;
  accessToken: Nullable<string>;
  queryClient: QueryClient;
}) {
  return queryClient.prefetchQuery({
    queryKey: queryKeyStore.secret.getUseNamespaceSecretQueryKey({
      namespaceId,
      secretId,
    }),
    queryFn: async () => {
      return await fetchNamespaceSecret({
        namespaceId,
        secretId,
        accessToken,
      });
    },
  });
}
