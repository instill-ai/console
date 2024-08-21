import { useQuery } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import { env } from "../../../server";
import { getInstillAPIClient } from "../../vdp-sdk";

export function usePaginatedPipelineRunComponents({
  pipelineRunId,
  accessToken,
  enabled,
  retry,
  pageSize,
  page,
  //orderBy,
  //filter,
  //fullView,
}: {
  pipelineRunId: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  retry?: false | number;
  //fullView?: boolean;
  pageSize?: number;
  page?: number;
  //orderBy?: string;
  //filter?: string;
}) {
  const queryKey = [
    "pipeline-component-runs",
    pipelineRunId,
    "paginated",
    accessToken ? 'withAuth' : 'unAuth',
    //fullView ? 'VIEW_FULL' : 'VIEW_BASIC',
    pageSize || env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
    page || 0,
  ];

  /* if (orderBy) {
    queryKey.push(orderBy);
  } */

  /* if (filter) {
    queryKey.push(filter);
  } */

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!pipelineRunId) {
        return Promise.reject(new Error("pipelineRunId not provided"));
      }

      const client = getInstillAPIClient({
        accessToken: accessToken ?? undefined,
      });

      const data = await client.vdp.pipeline.listPaginatedNamespacePipelineRunComponents({
        pipelineRunId,
        pageSize: pageSize || env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
        //fullView: !!fullView,
        page: page || 0,
        //orderBy: orderBy || null,
        //filter: filter || null,
      });

      return Promise.resolve(data);
    },
    enabled,
    retry: retry === false ? false : retry ? retry : 3,
  });
}