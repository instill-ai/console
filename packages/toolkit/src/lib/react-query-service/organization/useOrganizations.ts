import { useQuery } from "@tanstack/react-query";
import { listOrganizationsQuery } from "../../vdp-sdk";
import { env } from "../../utility";
import type { Nullable } from "../../type";

export const useOrganizations = ({
  accessToken,
  enabled,
  retry,
}: {
  accessToken: Nullable<string>;
  enabled: boolean;
  /**
   * - Default is 3
   * - Set to false to disable retry
   */
  retry?: false | number;
}) => {
  return useQuery(
    ["organizations"],
    async () => {
      const tokens = await listOrganizationsQuery({
        pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
        nextPageToken: null,
        accessToken,
        filter: null,
      });

      return Promise.resolve(tokens);
    },
    {
      enabled,
      retry: retry === false ? false : retry ? retry : 3,
    }
  );
};
