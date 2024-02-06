import { useQuery } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import { getOrganizationMembershipQuery } from "../../vdp-sdk";

export function useOrganizationMembership({
  organizationID,
  userID,
  accessToken,
  enabled,
  retry,
}: {
  organizationID: Nullable<string>;
  userID: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;

  retry?: false | number;
}) {
  let enableQuery = false;

  if (organizationID && userID && enabled) {
    enableQuery = true;
  }

  return useQuery(
    ["organizations", organizationID, "memberships", userID],
    async () => {
      if (!accessToken) {
        return Promise.reject(new Error("Access Token not provided"));
      }

      if (!organizationID) {
        return Promise.reject(new Error("organizationID name not provided"));
      }
      if (!userID) {
        return Promise.reject(new Error("userID not provided"));
      }

      const membership = await getOrganizationMembershipQuery({
        organizationID,
        accessToken,
        userID,
      });

      return Promise.resolve(membership);
    },
    {
      enabled: enableQuery,
      retry: retry === false ? false : retry ? retry : 3,
    }
  );
}
