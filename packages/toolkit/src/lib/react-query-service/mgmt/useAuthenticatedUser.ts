import { useQuery } from "@tanstack/react-query";
import { getAuthenticatedUserQuery, type User } from "../../vdp-sdk";
import type { Nullable } from "../../type";

export function useAuthenticatedUser({
  accessToken,
  enabled,
  retry,
}: {
  accessToken: Nullable<string>;
  enabled: boolean;
  retry?: false | number;
}) {
  return useQuery(
    ["authenticated-user"],
    async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const user = await getAuthenticatedUserQuery({ accessToken });

      return Promise.resolve(user);
    },
    {
      enabled,
      retry: retry === false ? false : retry ? retry : 3,
    }
  );
}
