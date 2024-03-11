import { QueryClient } from "@tanstack/react-query";
import { Nullable } from "../../../type";
import { getUserQuery } from "../../../vdp-sdk";

export async function fetchUser({
  userName,
  accessToken,
}: {
  userName: Nullable<string>;
  accessToken: Nullable<string>;
}) {
  try {
    if (!userName) {
      return Promise.reject(new Error("userName not provided"));
    }

    const user = await getUserQuery({ userName, accessToken });

    return Promise.resolve(user);
  } catch (error) {
    return Promise.reject(error);
  }
}

export function getUseUserQueryKey(userName: Nullable<string>) {
  return ["users", userName];
}

export function prefetchUser({
  userName,
  accessToken,
  queryClient,
}: {
  userName: Nullable<string>;
  accessToken: Nullable<string>;
  queryClient: QueryClient;
}) {
  const queryKey = getUseUserQueryKey(userName);

  return queryClient.prefetchQuery({
    queryKey,
    queryFn: async () => {
      return await fetchUser({
        userName,
        accessToken,
      });
    },
  });
}
