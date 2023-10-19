import { useQuery } from "@tanstack/react-query";
import { getApiTokenQuery } from "../../vdp-sdk";
import type { Nullable } from "../../type";

export const useApiToken = ({
  tokenName,
  accessToken,
  enabled,
  retry,
}: {
  tokenName: string;
  accessToken: Nullable<string>;
  enabled: boolean;
  /**
   * - Default is 3
   * - Set to false to disable retry
   */
  retry?: false | number;
}) => {
  return useQuery(
    ["api-tokens", tokenName],
    async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const token = await getApiTokenQuery({
        tokenName,
        accessToken,
      });

      return Promise.resolve(token);
    },
    {
      enabled,
      retry: retry === false ? false : retry ? retry : 3,
    }
  );
};
