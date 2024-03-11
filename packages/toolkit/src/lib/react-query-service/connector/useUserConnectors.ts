import { useQuery } from "@tanstack/react-query";
import { env } from "../../utility";
import type { Nullable } from "../../type";
import { ConnectorType, listUserConnectorsQuery } from "../../vdp-sdk";

export function useUserConnectors({
  userName,
  connectorType,
  accessToken,
  enabled,
  retry,
}: {
  userName: Nullable<string>;
  connectorType: ConnectorType | "all";
  accessToken: Nullable<string>;
  enabled: boolean;
  retry?: false | number;
}) {
  let enableQuery = false;

  if (userName && enabled) {
    enableQuery = true;
  }

  return useQuery({
    queryKey: [userName, "connectors", connectorType],
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      if (!userName) {
        return Promise.reject(new Error("userName not provided"));
      }

      const connectorsWithDefinition = await listUserConnectorsQuery({
        userName,
        pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
        nextPageToken: null,
        accessToken,
        filter:
          connectorType !== "all" ? `connector_type=${connectorType}` : null,
      });

      return Promise.resolve(connectorsWithDefinition);
    },
    enabled: enableQuery,
    retry: retry === false ? false : retry ? retry : 3,
  });
}
