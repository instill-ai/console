import { useQuery } from "@tanstack/react-query";
import { env } from "../../utility";
import { listModelsQuery } from "../../vdp-sdk";
import type { Nullable } from "../../type";

export const useModels = ({
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
  return useQuery(
    ["models"],
    async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const models = await listModelsQuery({
        pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
        nextPageToken: null,
        accessToken,
      });

      return Promise.resolve(models);
    },
    {
      enabled,
      retry: retry === false ? false : retry ? retry : 3,
    }
  );
};
