import { useQuery } from "@tanstack/react-query";
import { getUserQuery, type User } from "../../vdp-sdk";
import type { Nullable } from "../../type";

export const useUser = ({
  accessToken,
  enabled,
  retry,
}: {
  accessToken: Nullable<string>;
  enabled: boolean;
  /**
   * - Default is 3
   * - Set to false to disable retry
   */
  retry?: false | number;
}) => {
  return useQuery<User>(
    ["user"],
    async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const user = await getUserQuery({ accessToken });

      return Promise.resolve(user);
    },
    {
      enabled,
      retry: retry === false ? false : retry ? retry : 3,
    }
  );
};
