"use client";

import type { Nullable, ResourceView } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { env } from "../../../server";
import { getInstillAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function usePaginatedNamepsacePipelineComponentRuns({
  pipelineRunId,
  accessToken,
  enabled,
  pageSize,
  page,
  orderBy,
  filter,
  view,
  requesterUid,
}: {
  enabled: boolean;
  pipelineRunId: Nullable<string>;
  accessToken: Nullable<string>;
  view: Nullable<ResourceView>;
  pageSize: Nullable<number>;
  page: Nullable<number>;
  orderBy: Nullable<string>;
  filter: Nullable<string>;
  requesterUid: Nullable<string>;
}) {
  return useQuery({
    queryKey:
      queryKeyStore.release.getUsePaginatedNamepsacePipelineComponentRunsQueryKey(
        {
          pipelineRunId,
          accessToken,
          view,
          orderBy,
          filter,
          requesterUid,
          pageSize,
        },
      ),
    queryFn: async () => {
      if (!pipelineRunId) {
        return Promise.reject(new Error("pipelineRunId not provided"));
      }

      const client = getInstillAPIClient({
        accessToken: accessToken ?? undefined,
      });

      const data =
        await client.vdp.trigger.listPaginatedNamespacePipelineComponentRuns({
          pipelineRunId,
          pageSize: pageSize ?? env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
          view: view ?? "VIEW_BASIC",
          page: page ?? undefined,
          orderBy: orderBy ?? undefined,
          filter: filter ?? undefined,
          requesterUid: requesterUid ?? undefined,
        });

      return Promise.resolve(data);
    },
    enabled,
  });
}
