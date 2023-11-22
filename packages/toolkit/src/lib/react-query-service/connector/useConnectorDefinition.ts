import { useQuery } from "@tanstack/react-query";
import { getConnectorDefinitionQuery } from "../../vdp-sdk";
import type { Nullable } from "../../type";

export const useConnectorDefinition = ({
  connectorDefinitionName,
  accessToken,
  enabled,
  retry,
}: {
  connectorDefinitionName: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  /**
   * - Default is 3
   * - Set to false to disable retry
   */
  retry?: false | number;
}) => {
  let enableQuery = false;

  if (connectorDefinitionName && enabled) {
    enableQuery = true;
  }

  return useQuery(
    ["connector-definitions", connectorDefinitionName],
    async () => {
      if (!connectorDefinitionName) {
        return Promise.reject(
          new Error("connectorDefinitionName not provided")
        );
      }

      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const connectorDefinition = await getConnectorDefinitionQuery({
        connectorDefinitionName,
        accessToken,
      });

      return Promise.resolve(connectorDefinition);
    },
    {
      enabled: enableQuery,
      retry: retry === false ? false : retry ? retry : 3,
    }
  );
};
