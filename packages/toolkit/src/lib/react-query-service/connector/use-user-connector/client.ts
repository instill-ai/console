import { useQuery } from "@tanstack/react-query";
import type { Nullable } from "../../../type";
import { fetchUserConnector, getUseUserConnectorQueryKey } from "./server";

export function useUserConnector({
  connectorName,
  accessToken,
  enabled,
  retry,
}: {
  connectorName: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  retry?: false | number;
}) {
  let enableQuery = false;

  if (connectorName && enabled) {
    enableQuery = true;
  }

  return useQuery({
    queryKey: getUseUserConnectorQueryKey(connectorName),
    queryFn: async () => {
      return await fetchUserConnector({
        connectorName,
        accessToken,
      });
    },
    enabled: enableQuery,
    retry: retry === false ? false : retry ? retry : 3,
  });
}
