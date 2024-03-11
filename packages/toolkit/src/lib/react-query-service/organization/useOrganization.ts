import { useQuery } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import { getOrganizationQuery } from "../../vdp-sdk";

export function useOrganization({
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
    queryKey: ["organization", organizationID],
    queryFn: async () => {
      if (!organizationID) {
        return Promise.reject(new Error("organizationID not provided"));
      }

      const organization = await getOrganizationQuery({
        organizationID,
        accessToken,
      });

      return Promise.resolve(organization);
    },
    enabled: enableQuery,
    retry: retry === false ? false : retry ? retry : 3,
  });
}
