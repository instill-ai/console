import { QueryClient } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../../sdk-helper";
import { Nullable } from "../../../type";

export async function fetchAuthenticatedUser({
  accessToken,
}: {
  accessToken: Nullable<string>;
}) {
  if (!accessToken) {
    return Promise.reject(new Error("accessToken not provided"));
  }

  try {
    const client = getInstillAPIClient({ accessToken });

    const user = await client.mgmt.user.getAuthenticatedUser();

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
