import { useQuery } from "@tanstack/react-query";

import type { Nullable } from "../../type";
import { env } from "../../../server";
import { ConnectorType, listConnectorDefinitionsQuery } from "../../vdp-sdk";

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
          connectorType !== "all" ? `connectorType=${connectorType}` : null,
      });
      return Promise.resolve(connectorDefinitions);
    },
    enabled,
    retry: retry === false ? false : retry ? retry : 3,
  });
}
