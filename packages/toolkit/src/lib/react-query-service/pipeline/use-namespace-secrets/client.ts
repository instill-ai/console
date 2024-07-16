import { useQuery } from "@tanstack/react-query";

import { Nullable } from "../../../type";
import {
  fetchNamespaceSecrets,
  getUseNamespaceSecretsQueryKey,
} from "./server";

export function useNamespaceSecrets({
  namespaceName,
  accessToken,
  enabled,
  pageSize,
}: {
  namespaceName: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  pageSize?: number;
}) {
  let enabledQuery = false;

  if (namespaceName && enabled) {
    enabledQuery = true;
  }

  const queryKey = getUseNamespaceSecretsQueryKey(namespaceName);

  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        return await fetchNamespaceSecrets({
          namespaceName,
          accessToken,
          pageSize,
        });
      } catch (error) {
        return Promise.reject(error);
      }
    },
    enabled: enabledQuery,
  });
}
