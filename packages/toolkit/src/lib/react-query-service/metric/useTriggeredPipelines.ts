import { useQuery } from "@tanstack/react-query";
import { Nullable } from "../../type";
import { listTriggeredPipelineQuery } from "../../vdp-sdk";
import { env } from "../../utility";

export const useTriggeredPipelines = ({
  enabled,
  accessToken,
  filter,
  retry,
}: {
  enabled: boolean;
  accessToken: Nullable<string>;
  filter: Nullable<string>;
  /**
   * - Default is 3
   * - Set to false to disable retry
   */
  retry?: false | number;
}) => {
  return useQuery(
    ["tables", filter],
    async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const triggers = await listTriggeredPipelineQuery({
        pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
        nextPageToken: null,
        accessToken,
        filter,
      });

      return Promise.resolve(triggers);
    },
    {
      enabled,
      retry: retry === false ? false : retry ? retry : 3,
    }
  );
};
