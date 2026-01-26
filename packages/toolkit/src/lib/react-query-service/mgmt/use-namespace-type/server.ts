import { QueryClient } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../../sdk-helper";
import { Nullable } from "../../../type";

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
    });

    const type = await client.mgmt.utils.checkNamespaceType({
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
