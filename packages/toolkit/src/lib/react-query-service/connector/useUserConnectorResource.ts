import { useQuery } from "@tanstack/react-query";
import {
  getConnectorDefinitionQuery,
  getUserConnectorResourceQuery,
  type ConnectorResourceWithDefinition,
} from "../../vdp-sdk";
import type { Nullable } from "../../type";

export const useUserConnectorResource = ({
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
}) => {
  let enableQuery = false;

  if (connectorResourceName && enabled) {
    enableQuery = true;
  }

  return useQuery(
    ["connector-resources", connectorResourceName],
    async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      if (!connectorResourceName) {
        return Promise.reject(new Error("connectorResourceName not provided"));
      }

      const connectorResource = await getUserConnectorResourceQuery({
        connectorResourceName,
        accessToken,
      });

      const connectorDefinition = await getConnectorDefinitionQuery({
        connectorDefinitionName: connectorResource.connector_definition_name,
        accessToken,
      });

      const connectorResourceWithDefinition: ConnectorResourceWithDefinition = {
        ...connectorResource,
        connector_definition: connectorDefinition,
      };

      return Promise.resolve(connectorResourceWithDefinition);
    },
    {
      enabled: enableQuery,
      retry: retry === false ? false : retry ? retry : 3,
    }
  );
};
