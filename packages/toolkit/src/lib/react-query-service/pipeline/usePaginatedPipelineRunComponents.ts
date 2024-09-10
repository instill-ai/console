import { useQuery } from "@tanstack/react-query";
import { ResourceView } from "instill-sdk";

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
  orderBy,
  filter,
  view = "VIEW_BASIC",
  requesterUid,
}: {
  pipelineRunId: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  retry?: false | number;
  view?: ResourceView;
  pageSize?: number;
  page?: number;
  orderBy?: Nullable<string>;
  filter?: string;
  requesterUid?: string;
}) {
  const queryKey = [
    "pipeline-component-runs",
    pipelineRunId,
    "paginated",
    accessToken ? "withAuth" : "unAuth",
    view,
    pageSize || env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
    page || 0,
  ];

  if (orderBy) {
    queryKey.push(orderBy);
  }

  if (filter) {
    queryKey.push(filter);
  }

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!pipelineRunId) {
        return Promise.reject(new Error("pipelineRunId not provided"));
      }

      const client = getInstillAPIClient({
        accessToken: accessToken ?? undefined,
      });

      const data =
        await client.vdp.pipeline.listPaginatedNamespacePipelineRunComponents({
          pipelineRunId,
          pageSize: pageSize || env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
          view,
          page: page || 0,
          orderBy: orderBy || null,
          filter: filter || null,
          requesterUid,
        });

      return Promise.resolve(data);
    },
    enabled,
    retry: retry === false ? false : retry ? retry : 3,
  });
}
