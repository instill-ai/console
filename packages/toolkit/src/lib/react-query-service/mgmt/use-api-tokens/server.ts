import { QueryClient } from "@tanstack/react-query";

import { env } from "../../../../server";
import { Nullable } from "../../../type";
import { getInstillAPIClient } from "../../../vdp-sdk";

export async function fetchApiTokens({
  accessToken,
}: {
  accessToken: Nullable<string>;
}) {
  if (!accessToken) {
    return Promise.reject(new Error("accessToken not provided"));
  }

  try {
    const client = getInstillAPIClient({ accessToken, publicAccess: false });

    const apiTokens = await client.core.token.listAPITokens({
      pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
      enablePagination: false,
    });

    return Promise.resolve(apiTokens);
  } catch (error) {
    return Promise.reject(error);
  }
}

export function getUseApiTokensQueryKey() {
  return ["api-tokens"];
}

export function prefetchApiTokens({
  accessToken,
  queryClient,
}: {
  accessToken: Nullable<string>;
  queryClient: QueryClient;
}) {
  const queryKey = getUseApiTokensQueryKey();

  return queryClient.prefetchQuery({
    queryKey,
    queryFn: async () => {
      return await fetchApiTokens({
        accessToken,
      });
    },
  });
}
