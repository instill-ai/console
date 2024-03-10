import { useQuery } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import { getUserMembershipQuery } from "../../vdp-sdk";

export function useUserMembership({
  userID,
  organizationID,
  accessToken,
  enabled,
  retry,
}: {
  userID: Nullable<string>;
  organizationID: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  retry?: false | number;
}) {
  let enabledQuery = false;

  if (userID && enabled && organizationID) {
    enabledQuery = true;
  }

  return useQuery({
    queryKey: ["users", userID, "memberships", organizationID],
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      if (!userID) {
        return Promise.reject(new Error("userID not provided"));
      }

      if (!organizationID) {
        return Promise.reject(new Error("organizationID not provided"));
      }

      const membership = await getUserMembershipQuery({
        userID,
        organizationID,
        accessToken,
      });

      return Promise.resolve(membership);
    },
    enabled: enabledQuery,
    retry: retry === false ? false : retry ? retry : 3,
  });
}
