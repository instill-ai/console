import { useQuery } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import { getOrganizationQuery } from "../../vdp-sdk";

// This is a public API, we won't block unauth users from accessing this

export const useOrganization = ({
  organizationID,
  accessToken,
  enabled,
  retry,
}: {
  organizationID: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  /**
   * - Default is 3
   * - Set to false to disable retry
   */
  retry?: false | number;
}) => {
  let enableQuery = false;

  if (organizationID && enabled) {
    enableQuery = true;
  }

  return useQuery(
    ["organization", organizationID],
    async () => {
      if (!organizationID) {
        return Promise.reject(new Error("organizationID not provided"));
      }

      const organization = await getOrganizationQuery({
        organizationID,
        accessToken,
      });

      return Promise.resolve(organization);
    },
    {
      enabled: enableQuery,
      retry: retry === false ? false : retry ? retry : 3,
    }
  );
};
