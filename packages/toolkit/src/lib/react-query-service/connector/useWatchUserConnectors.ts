import { useQuery } from "@tanstack/react-query";

import type { Nullable } from "../../type";
import { ConnectorsWatchState, watchUserConnector } from "../../vdp-sdk";

export function useWatchUserConnectors({
  connectorNames,
  accessToken,
  enabled,
  retry,
}: {
  connectorNames: Nullable<string[]>;
  accessToken: Nullable<string>;
  enabled: boolean;
  retry?: false | number;
}) {
  let enableQuery = false;

  if (connectorNames && enabled && connectorNames.length > 0) {
    enableQuery = true;
  }

  return useQuery({
    queryKey: ["connectors", "watch"],
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      if (!connectorNames || connectorNames.length === 0) {
        return Promise.reject(new Error("Invalid connector names"));
      }

      const watches: ConnectorsWatchState = {};

      for (const connectorName of connectorNames) {
        const watch = await watchUserConnector({
          connectorName,
          accessToken,
        });
        watches[connectorName] = watch;
      }

      return Promise.resolve(watches);
    },
    enabled: enableQuery,
    retry: retry === false ? false : retry ? retry : 3,
  });
}
