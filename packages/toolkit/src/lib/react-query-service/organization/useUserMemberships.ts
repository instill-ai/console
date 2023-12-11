import { useQuery } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import { getUserMembershipsQuery } from "../../vdp-sdk";

export const useUserMemberships = ({
  userID,
  accessToken,
  enabled,
  retry,
}: {
  userID: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  /**
   * - Default is 3
   * - Set to false to disable retry
   */
  retry?: false | number;
}) => {
  let enabledQuery = false;

  if (userID && enabled) {
    enabledQuery = true;
  }

  return useQuery(
    ["users", userID, "memberships"],
    async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      if (!userID) {
        return Promise.reject(new Error("userID not provided"));
      }

      const memberships = await getUserMembershipsQuery({
        userID,
        accessToken,
      });

      return Promise.resolve(memberships);
    },
    {
      enabled: enabledQuery,
      retry: retry === false ? false : retry ? retry : 3,
    }
  );
};
