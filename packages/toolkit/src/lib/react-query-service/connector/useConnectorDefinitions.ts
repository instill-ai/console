import { useQuery } from "@tanstack/react-query";
import { env } from "../../utility";
import { ConnectorType, listConnectorDefinitionsQuery } from "../../vdp-sdk";
import type { Nullable } from "../../type";

export function useConnectorDefinitions({
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
  return useQuery({
    queryKey: ["connector-definitions", connectorType],
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const connectorDefinitions = await listConnectorDefinitionsQuery({
        pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
        nextPageToken: null,
        accessToken,
        filter:
          connectorType !== "all" ? `connector_type=${connectorType}` : null,
      });
      return Promise.resolve(connectorDefinitions);
    },
    enabled,
    retry: retry === false ? false : retry ? retry : 3,
  });
}
