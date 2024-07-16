import { QueryClient } from "@tanstack/react-query";

import { env } from "../../../../server";
import { Nullable } from "../../../type";
import { getInstillAPIClient } from "../../../vdp-sdk";

export async function fetchNamespaceSecrets({
  namespaceName,
  accessToken,
  pageSize,
}: {
  namespaceName: Nullable<string>;
  accessToken: Nullable<string>;
  pageSize?: number;
}) {
  if (!namespaceName) {
    throw new Error("namespaceName not provided");
  }

  if (!accessToken) {
    throw new Error("accessToken not provided");
  }

  try {
    const client = getInstillAPIClient({ accessToken });

    const userSecrets = await client.vdp.secret.listNamespaceSecrets({
      pageSize: pageSize ?? env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
      namespaceName,
      enablePagination: false,
    });

    return Promise.resolve(userSecrets);
  } catch (error) {
    return Promise.reject(error);
  }
}

export function getUseNamespaceSecretsQueryKey(
  namespaceName: Nullable<string>,
) {
  return ["secrets", namespaceName];
}

export function prefetchNamespaceSecrets({
  namespaceName,
  accessToken,
  queryClient,
}: {
  namespaceName: Nullable<string>;
  accessToken: Nullable<string>;
  queryClient: QueryClient;
}) {
  const queryKey = getUseNamespaceSecretsQueryKey(namespaceName);

  return queryClient.prefetchQuery({
    queryKey,
    queryFn: async () => {
      return await fetchNamespaceSecrets({
        namespaceName,
        accessToken,
      });
    },
  });
}
