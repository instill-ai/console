import { QueryClient } from "@tanstack/react-query";
import { Nullable } from "../../../type";
import { listApiTokensQuery } from "../../../vdp-sdk";
import { env } from "../../../../server";

export async function fetchApiTokens({
  accessToken,
}: {
  accessToken: Nullable<string>;
}) {
  try {
    if (!accessToken) {
      return Promise.reject(new Error("accessToken not provided"));
    }

    const apiTokens = await listApiTokensQuery({
      pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
      nextPageToken: null,
      accessToken,
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
