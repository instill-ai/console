import { useQuery } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import { watchUserConnectorResource } from "../../vdp-sdk";

export function useWatchUserConnectorResource({
  connectorResourceName,
  accessToken,
  enabled,
  retry,
}: {
  connectorResourceName: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  /**
   * - Default is 3
   * - Set to false to disable retry
   */
  retry?: false | number;
}) {
  let enableQuery = false;

  if (connectorResourceName && enabled) {
    enableQuery = true;
  }

  return useQuery(
    ["connector-resources", connectorResourceName, "watch"],
    async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      if (!connectorResourceName) {
        return Promise.reject(new Error("connectorResourceName not provided"));
      }

      const watch = await watchUserConnectorResource({
        connectorResourceName,
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
