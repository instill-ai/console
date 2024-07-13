import { QueryClient } from "@tanstack/react-query";

import { Nullable } from "../../../type";
import { getInstillAPIClient } from "../../../vdp-sdk";

export async function fetchAuthenticatedUser({
  accessToken,
}: {
  accessToken: Nullable<string>;
}) {
  if (!accessToken) {
    return Promise.reject(new Error("accessToken not provided"));
  }

  try {
    const client = getInstillAPIClient({ accessToken, publicAccess: false });

    const user = await client.core.user.getAuthenticatedUser();

    return Promise.resolve(user);
  } catch (error) {
    return Promise.reject(error);
  }
}

export function getUseAuthenticatedUserQueryKey() {
  return ["authenticated-user"];
}

export function prefetchAuthenticatedUser({
  accessToken,
  queryClient,
}: {
  accessToken: Nullable<string>;
  queryClient: QueryClient;
}) {
  const queryKey = getUseAuthenticatedUserQueryKey();

  return queryClient.prefetchQuery({
    queryKey,
    queryFn: async () => {
      return await fetchAuthenticatedUser({
        accessToken,
      });
    },
  });
}
