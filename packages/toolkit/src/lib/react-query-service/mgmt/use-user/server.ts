import type { Nullable } from "instill-sdk";
import { QueryClient } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../../sdk-helper";
import { queryKeyStore } from "../../queryKeyStore";

export async function fetchUser({
  userId,
  accessToken,
}: {
  userId: Nullable<string>;
  accessToken: Nullable<string>;
}) {
  if (!userId) {
    return Promise.reject(new Error("userId is required"));
  }

  try {
    const client = getInstillAPIClient({
      accessToken: accessToken ?? undefined,
    });

    const user = await client.mgmt.user.getUser({ userId });

    return Promise.resolve(user);
  } catch (error) {
    return Promise.reject(error);
  }
}

export function prefetchUser({
  userId,
  accessToken,
  queryClient,
}: {
  userId: Nullable<string>;
  accessToken: Nullable<string>;
  queryClient: QueryClient;
}) {
  return queryClient.prefetchQuery({
    queryKey: queryKeyStore.mgmt.getUseUserQueryKey({ userId }),
    queryFn: async () => {
      return await fetchUser({
        userId,
        accessToken,
      });
    },
  });
}
