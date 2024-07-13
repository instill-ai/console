import { QueryClient } from "@tanstack/react-query";

import { Nullable } from "../../../type";
import { getInstillAPIClient } from "../../../vdp-sdk";

export async function fetchNamespaceSecret({
  namespaceSecretName,
  accessToken,
}: {
  namespaceSecretName: Nullable<string>;
  accessToken: Nullable<string>;
}) {
  if (!namespaceSecretName) {
    throw new Error("namespaceSecretName not provided");
  }

  if (!accessToken) {
    throw new Error("accessToken not provided");
  }

  try {
    const client = getInstillAPIClient({ accessToken, publicAccess: false });

    const userSecret = await client.vdp.secret.getNamespaceSecret({
      namespaceSecretName,
    });

    return Promise.resolve(userSecret);
  } catch (error) {
    return Promise.reject(error);
  }
}

export function getUseNamespaceSecretQueryKey(secretName: Nullable<string>) {
  return ["secrets", secretName];
}

export function prefetchNamespaceSecret({
  namespaceSecretName,
  accessToken,
  queryClient,
}: {
  namespaceSecretName: Nullable<string>;
  accessToken: Nullable<string>;
  queryClient: QueryClient;
}) {
  const queryKey = getUseNamespaceSecretQueryKey(namespaceSecretName);

  return queryClient.prefetchQuery({
    queryKey,
    queryFn: async () => {
      return await fetchNamespaceSecret({
        namespaceSecretName,
        accessToken,
      });
    },
  });
}
