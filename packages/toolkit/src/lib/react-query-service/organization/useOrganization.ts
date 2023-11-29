import { useQuery } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import { getOrganizationQuery } from "../../vdp-sdk";

export const useOrganization = ({
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
    ["organization", organizationName],
    async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      if (!organizationName) {
        return Promise.reject(new Error("Organization name not provided"));
      }

      const model = await getOrganizationQuery({
        organizationName,
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
