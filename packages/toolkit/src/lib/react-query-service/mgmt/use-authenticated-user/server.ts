import { QueryClient } from "@tanstack/react-query";
import { Nullable } from "../../../type";
import { getAuthenticatedUserQuery } from "../../../vdp-sdk";

export async function fetchAuthenticatedUser({
  accessToken,
}: {
  accessToken: Nullable<string>;
}) {
  try {
    if (!accessToken) {
      return Promise.reject(new Error("accessToken not provided"));
    }

    const user = await getAuthenticatedUserQuery({ accessToken });

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
