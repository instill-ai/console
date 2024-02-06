import { useQuery } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import { watchUserConnector } from "../../vdp-sdk";

export function useWatchUserConnector({
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

  return useQuery(
    ["connectors", connectorName, "watch"],
    async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      if (!connectorName) {
        return Promise.reject(new Error("connectorName not provided"));
      }

      const watch = await watchUserConnector({
        connectorName,
        accessToken,
      });

      return Promise.resolve(watch);
    },
    {
      enabled: enableQuery,
      retry: retry === false ? false : retry ? retry : 3,
    }
  );
}
