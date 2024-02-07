import { useQuery } from "@tanstack/react-query";
import { env } from "../../utility";
import {
  ConnectorType,
  ConnectorWithDefinition,
  getConnectorDefinitionQuery,
  listConnectorsQuery,
} from "../../vdp-sdk";
import type { Nullable } from "../../type";

export function useConnectors({
  connectorType,
  accessToken,
  enabled,
  retry,
}: {
  connectorType: ConnectorType | "all";
  accessToken: Nullable<string>;
  enabled: boolean;
  retry?: false | number;
}) {
  return useQuery(
    ["connectors", connectorType],
    async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const connectors = await listConnectorsQuery({
        pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
        nextPageToken: null,
        accessToken,
        filter:
          connectorType !== "all" ? `connector_type=${connectorType}` : null,
      });

      const connectorsWithDefinition: ConnectorWithDefinition[] = [];

      for (const connector of connectors) {
        const definition = await getConnectorDefinitionQuery({
          connectorDefinitionName: connector.connector_definition_name,
          accessToken,
        });
        connectorsWithDefinition.push({
          ...connector,
          connector_definition: definition,
        });
      }

      return Promise.resolve(connectorsWithDefinition);
    },
    {
      enabled,
      retry: retry === false ? false : retry ? retry : 3,
    }
  );
}
