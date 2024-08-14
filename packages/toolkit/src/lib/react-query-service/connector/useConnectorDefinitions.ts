import { useQuery } from "@tanstack/react-query";

import type { Nullable } from "../../type";
import { env } from "../../../server";
import { ConnectorType, getInstillAPIClient } from "../../vdp-sdk";

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

      const client = getInstillAPIClient({ accessToken });

      const connectorDefinitions =
        await client.vdp.component.listConnectorDefinitions({
          pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
          filter:
            connectorType !== "all"
              ? `connectorType=${connectorType}`
              : undefined,
          enablePagination: false,
          view: "VIEW_FULL",
        });

      return Promise.resolve(connectorDefinitions);
    },
    enabled,
    retry: retry === false ? false : retry ? retry : 3,
  });
}
