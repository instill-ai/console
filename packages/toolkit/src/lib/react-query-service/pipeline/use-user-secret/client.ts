import { useQuery } from "@tanstack/react-query";
import { Nullable } from "../../../type";
import { fetchUserSecret, getUseUserSecretQueryKey } from "./server";

export function useUserSecret({
  secretName,
  accessToken,
  enabled,
}: {
  secretName: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
}) {
  let enabledQuery = false;

  if (secretName && enabled) {
    enabledQuery = true;
  }

  const queryKey = getUseUserSecretQueryKey(secretName);

  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        return await fetchUserSecret({
          secretName,
          accessToken,
        });
      } catch (error) {
        return Promise.reject(error);
      }
    },
    enabled: enabledQuery,
  });
}
