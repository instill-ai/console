import { useQuery } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import { getOrganizationsSubscription } from "../../vdp-sdk";

export const useOrganizationsSubscription = ({
  oraganizationName,
  accessToken,
  enabled,
  retry,
}: {
  oraganizationName: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  /**
   * - Default is 3
   * - Set to false to disable retry
   */
  retry?: false | number;
}) => {
  let enableQuery = false;

  if (oraganizationName && enabled) {
    enableQuery = true;
  }

  return useQuery(
    ["organizations", oraganizationName, "subscription"],
    async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      if (!oraganizationName) {
        return Promise.reject(new Error("oragnaization name not provided"));
      }

      const model = await getOrganizationsSubscription({
        oraganizationName,
        accessToken,
      });

      return Promise.resolve(model);
    },
    {
      enabled: enableQuery,
      retry: retry === false ? false : retry ? retry : 3,
    }
  );
};
