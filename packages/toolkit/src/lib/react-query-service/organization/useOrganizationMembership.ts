import { useQuery } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import { getOrganizationMembership } from "../../vdp-sdk";

export const useOrganizationMembership = ({
  organizationName,
  userName,
  accessToken,
  enabled,
  retry,
}: {
  organizationName: Nullable<string>;
  userName: Nullable<string>;
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
    ["organizations", organizationName, "memberships", userName],
    async () => {
      if (!accessToken) {
        return Promise.reject(new Error("Access Token not provided"));
      }

      if (!organizationName) {
        return Promise.reject(new Error("Organization name not provided"));
      }
      if (!userName) {
        return Promise.reject(new Error("User name not provided"));
      }

      const membership = await getOrganizationMembership({
        organizationName,
        accessToken,
        userName,
      });

      return Promise.resolve(membership);
    },
    {
      enabled: enableQuery,
      retry: retry === false ? false : retry ? retry : 3,
    }
  );
};
