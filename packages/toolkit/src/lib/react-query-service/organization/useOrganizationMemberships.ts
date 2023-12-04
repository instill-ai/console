import { useQuery } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import { getOrganizationMemberships } from "../../vdp-sdk";

export const useOrganizationMemberships = ({
  organizationName,
  accessToken,
  enabled,
  retry,
}: {
  organizationName: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  /**
   * - Default is 3
   * - Set to false to disable retry
   */
  retry?: false | number;
}) => {
  let enableQuery = false;

  if (organizationName && enabled) {
    enableQuery = true;
  }

  return useQuery(
    ["organizations", organizationName, "memberships"],
    async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      if (!organizationName) {
        return Promise.reject(new Error("Organization name not provided"));
      }

      const membership = await getOrganizationMemberships({
        organizationName,
        accessToken,
      });

      return Promise.resolve(membership);
    },
    {
      enabled: enableQuery,
      retry: retry === false ? false : retry ? retry : 3,
    }
  );
};
