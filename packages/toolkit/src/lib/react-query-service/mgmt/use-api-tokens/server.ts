import { QueryClient } from "@tanstack/react-query";

import { env } from "../../../../server";
import { getInstillAPIClient } from "../../../sdk-helper";
import { Nullable } from "../../../type";
import { queryKeyStore } from "../../queryKeyStore";

export async function fetchAPITokens({
  accessToken,
}: {
  accessToken: Nullable<string>;
}) {
  if (!accessToken) {
    return Promise.reject(new Error("accessToken is required"));
  }

  try {
    const client = getInstillAPIClient({ accessToken });

    const res = await client.mgmt.token.listAPITokens({
      pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
    });

    return Promise.resolve(res.tokens);
  } catch (error) {
    return Promise.reject(error);
  }
}

export function prefetchAPITokens({
  accessToken,
  queryClient,
}: {
  accessToken: Nullable<string>;
  queryClient: QueryClient;
}) {
  return queryClient.prefetchQuery({
    queryKey: queryKeyStore.mgmt.getUseAPITokensQueryKey(),
    queryFn: async () => {
      return await fetchAPITokens({
        accessToken,
      });
    },
  });
}
