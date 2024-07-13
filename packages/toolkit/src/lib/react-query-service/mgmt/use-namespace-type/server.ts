import { QueryClient } from "@tanstack/react-query";

import { Nullable } from "../../../type";
import { getInstillAPIClient } from "../../../vdp-sdk";

export async function fetchNamespaceType({
  namespace,
  accessToken,
}: {
  namespace: Nullable<string>;
  accessToken: Nullable<string>;
}) {
  if (!namespace) {
    return Promise.reject(new Error("namespace not provided"));
  }

  try {
    const client = getInstillAPIClient({
      accessToken: accessToken ?? undefined,
      publicAccess: accessToken ? false : true,
    });

    const type = await client.core.utils.checkNamespaceType({
      id: namespace,
    });

    return Promise.resolve(type);
  } catch (error) {
    return Promise.reject(error);
  }
}

export function getUseNamespaceTypeQueryKey(namespace: Nullable<string>) {
  return ["namespaces", namespace];
}

export function prefetchNamespaceType({
  namespace,
  accessToken,
  queryClient,
}: {
  namespace: Nullable<string>;
  accessToken: Nullable<string>;
  queryClient: QueryClient;
}) {
  const queryKey = getUseNamespaceTypeQueryKey(namespace);

  return queryClient.prefetchQuery({
    queryKey,
    queryFn: async () => {
      return await fetchNamespaceType({
        namespace,
        accessToken,
      });
    },
  });
}
