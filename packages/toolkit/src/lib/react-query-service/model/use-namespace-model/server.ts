import { QueryClient } from "@tanstack/react-query";
import { Nullable } from "instill-sdk";

import { getInstillModelAPIClient } from "../../../vdp-sdk";

export async function fetchNamespaceModel({
  namespaceModelName,
  accessToken,
}: {
  namespaceModelName: Nullable<string>;
  accessToken: Nullable<string>;
}) {
  try {
    if (!namespaceModelName) {
      return Promise.reject(new Error("namespaceModelName not provided"));
    }

    const client = getInstillModelAPIClient({
      accessToken: accessToken ?? undefined,
    });

    const model = await client.model.getNamespaceModel({ namespaceModelName });

    return Promise.resolve(model);
  } catch (error) {
    return Promise.reject(error);
  }
}

export function getUseNamespaceModelQueryKey(
  namespaceModelName: Nullable<string>,
) {
  return ["models", namespaceModelName];
}

export function prefetchNamespaceModel({
  namespaceModelName,
  accessToken,
  queryClient,
}: {
  namespaceModelName: Nullable<string>;
  accessToken: Nullable<string>;
  queryClient: QueryClient;
}) {
  const queryKey = getUseNamespaceModelQueryKey(namespaceModelName);

  return queryClient.prefetchQuery({
    queryKey,
    queryFn: async () => {
      return await fetchNamespaceModel({
        namespaceModelName,
        accessToken,
      });
    },
  });
}
