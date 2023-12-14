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
      enablePagination: false,
    });
    return Promise.resolve(pipelines);
  } catch (err) {
    return Promise.reject(err);
  }
}

// This is a public API, we won't block unauth users from accessing this

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
      const pipelines = await fetchPipelines(accessToken);

      return Promise.resolve(pipelines);
    },
    {
      enabled,
      retry: retry === false ? false : retry ? retry : 3,
    }
  );
};
