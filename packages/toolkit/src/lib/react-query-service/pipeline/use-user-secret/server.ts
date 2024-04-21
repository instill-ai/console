import { QueryClient } from "@tanstack/react-query";
import { Nullable } from "../../../type";
import { getUserSecretQuery } from "../../../vdp-sdk";

export async function fetchUserSecret({
  secretName,
  accessToken,
}: {
  secretName: Nullable<string>;
  accessToken: Nullable<string>;
}) {
  try {
    if (!secretName) {
      throw new Error("secretName not provided");
    }

    const userSecret = await getUserSecretQuery({
      secretName,
      accessToken,
    });

    return Promise.resolve(userSecret);
  } catch (error) {
    return Promise.reject(error);
  }
}

export function getUseUserSecretQueryKey(secretName: Nullable<string>) {
  return ["secrets", secretName];
}

export function prefetchUserSecret({
  secretName,
  accessToken,
  queryClient,
}: {
  secretName: Nullable<string>;
  accessToken: Nullable<string>;
  queryClient: QueryClient;
}) {
  const queryKey = getUseUserSecretQueryKey(secretName);

  return queryClient.prefetchQuery({
    queryKey,
    queryFn: async () => {
      return await fetchUserSecret({
        secretName,
        accessToken,
      });
    },
  });
}
