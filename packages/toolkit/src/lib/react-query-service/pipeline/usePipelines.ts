import { useQuery } from "@tanstack/react-query";
import { listPipelinesQuery } from "../../vdp-sdk";
import { env } from "../../utility";
import type { Nullable } from "../../type";

export async function fetchPipelines(accessToken: Nullable<string>) {
  try {
    const pipelines = await listPipelinesQuery({
      pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
      nextPageToken: null,
      accessToken,
    });
    return Promise.resolve(pipelines);
  } catch (err) {
    return Promise.reject(err);
  }
}

export const usePipelines = ({
  enabled,
  accessToken,
  retry,
}: {
  enabled: boolean;
  accessToken: Nullable<string>;
  /**
   * - Default is 3
   * - Set to false to disable retry
   */
  retry?: false | number;
}) => {
  return useQuery(
    ["pipelines"],
    async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const pipelines = await fetchPipelines(accessToken);

      return Promise.resolve(pipelines);
    },
    {
      enabled,
      retry: retry === false ? false : retry ? retry : 3,
    }
  );
};
