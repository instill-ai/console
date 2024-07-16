import { useQuery } from "@tanstack/react-query";

import { Nullable } from "../../../type";
import { fetchNamespaceSecret, getUseNamespaceSecretQueryKey } from "./server";

export function useNamespaceSecret({
  namespaceSecretName,
  accessToken,
  enabled,
}: {
  namespaceSecretName: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
}) {
  let enabledQuery = false;

  if (namespaceSecretName && enabled) {
    enabledQuery = true;
  }

  const queryKey = getUseNamespaceSecretQueryKey(namespaceSecretName);

  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        return await fetchNamespaceSecret({
          namespaceSecretName,
          accessToken,
        });
      } catch (error) {
        return Promise.reject(error);
      }
    },
    enabled: enabledQuery,
  });
}
