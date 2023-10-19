import { useQuery } from "@tanstack/react-query";
import { env } from "../../utility";
import {
  listUserConnectorResourcesQuery,
  type ConnectorResourceType,
} from "../../vdp-sdk";
import type { Nullable } from "../../type";

export const useUserConnectorResources = ({
  userName,
  connectorResourceType,
  accessToken,
  enabled,
  retry,
}: {
  userName: Nullable<string>;
  connectorResourceType: ConnectorResourceType | "all";
  accessToken: Nullable<string>;
  enabled: boolean;
  /**
   * - Default is 3
   * - Set to false to disable retry
   */
  retry?: false | number;
}) => {
  let enableQuery = false;

  if (userName && enabled) {
    enableQuery = true;
  }

  return useQuery(
    ["connector-resources", userName, connectorResourceType],
    async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      if (!userName) {
        return Promise.reject(new Error("userName not provided"));
      }

      const connectorResourcesWithDefinition =
        await listUserConnectorResourcesQuery({
          userName,
          pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
          nextPageToken: null,
          accessToken,
          filter:
            connectorResourceType !== "all"
              ? `connector_type=${connectorResourceType}`
              : null,
        });

      return Promise.resolve(connectorResourcesWithDefinition);
    },
    {
      enabled: enableQuery,
      retry: retry === false ? false : retry ? retry : 3,
    }
  );
};
