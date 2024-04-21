import { useQuery } from "@tanstack/react-query";
import { Nullable } from "../../../type";
import { fetchUserSecrets, getUseUserSecretsQueryKey } from "./server";

export function useUserSecrets({
  entityName,
  accessToken,
  enabled,
  pageSize,
}: {
  entityName: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  pageSize?: number;
}) {
  let enableQuery = false;

  if (entityName && enabled) {
    enableQuery = true;
  }

  const queryKey = getUseUserSecretsQueryKey(entityName);

  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        return await fetchUserSecrets({
          entityName,
          accessToken,
          pageSize,
        });
      } catch (error) {
        return Promise.reject(error);
      }
    },
  });
}
