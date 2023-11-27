import { useQuery } from "@tanstack/react-query";
import {
  ConnectorWithDefinition,
  getConnectorDefinitionQuery,
  getUserConnectorQuery,
} from "../../vdp-sdk";
import type { Nullable } from "../../type";

export const useUserConnector = ({
  connectorName,
  accessToken,
  enabled,
  retry,
}: {
  connectorName: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  /**
   * - Default is 3
   * - Set to false to disable retry
   */
  retry?: false | number;
}) => {
  let enableQuery = false;

  if (connectorName && enabled) {
    enableQuery = true;
  }

  return useQuery(
    ["connectors", connectorName],
    async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      if (!connectorName) {
        return Promise.reject(new Error("connectorName not provided"));
      }

      const connector = await getUserConnectorQuery({
        connectorName,
        accessToken,
      });

      const connectorDefinition = await getConnectorDefinitionQuery({
        connectorDefinitionName: connector.connector_definition_name,
        accessToken,
      });

      const connectorWithDefinition: ConnectorWithDefinition = {
        ...connector,
        connector_definition: connectorDefinition,
      };

      return Promise.resolve(connectorWithDefinition);
    },
    {
      enabled: enableQuery,
      retry: retry === false ? false : retry ? retry : 3,
    }
  );
};
