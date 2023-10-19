import { useQuery } from "@tanstack/react-query";
import { env } from "../../utility";
import {
  ConnectorResourceType,
  listConnectorDefinitionsQuery,
} from "../../vdp-sdk";
import type { Nullable } from "../../type";

export const useConnectorDefinitions = ({
  connectorResourceType,
  accessToken,
  enabled,
  retry,
}: {
  connectorResourceType: ConnectorResourceType | "all";
  accessToken: Nullable<string>;
  enabled: boolean;
  /**
   * - Default is 3
   * - Set to false to disable retry
   */
  retry?: false | number;
}) => {
  return useQuery(
    ["connector-definitions", connectorResourceType],
    async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const connectorDefinitions = await listConnectorDefinitionsQuery({
        pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
        nextPageToken: null,
        accessToken,
        filter:
          connectorResourceType !== "all"
            ? `connector_type=${connectorResourceType}`
            : null,
      });
      return Promise.resolve(connectorDefinitions);
    },
    {
      enabled,
      retry: retry === false ? false : retry ? retry : 3,
    }
  );
};
