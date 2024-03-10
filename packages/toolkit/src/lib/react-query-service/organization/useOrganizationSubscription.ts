import { useQuery } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import { getOrganizationSubscriptionQuery } from "../../vdp-sdk";

export function useOrganizationSubscription({
  organizationID,
  accessToken,
  enabled,
  retry,
}: {
  organizationID: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  retry?: false | number;
}) {
  let enableQuery = false;

  if (organizationID && enabled) {
    enableQuery = true;
  }

  return useQuery({
    queryKey: ["organization", organizationID, "subscription"],
    queryFn: async () => {
      if (!organizationID) {
        return Promise.reject(new Error("organizationID not provided"));
      }

      const subscription = await getOrganizationSubscriptionQuery({
        organizationID,
        accessToken,
      });

      return Promise.resolve(subscription);
    },
    enabled: enableQuery,
    retry: retry === false ? false : retry ? retry : 3,
  });
}
