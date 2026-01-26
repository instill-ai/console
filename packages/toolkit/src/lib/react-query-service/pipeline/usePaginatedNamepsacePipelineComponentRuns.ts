"use client";

import type { Nullable, ResourceView } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { env } from "../../../server";
import { getInstillAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function usePaginatedNamepsacePipelineComponentRuns({
  namespaceId,
  pipelineId,
  pipelineRunId,
  accessToken,
  enabled,
  pageSize,
  page,
  orderBy,
  filter,
  view,
  requesterId,
}: {
  enabled: boolean;
  namespaceId: Nullable<string>;
  pipelineId: Nullable<string>;
  pipelineRunId: Nullable<string>;
  accessToken: Nullable<string>;
  view: Nullable<ResourceView>;
  pageSize: Nullable<number>;
  page: Nullable<number>;
  orderBy: Nullable<string>;
  filter: Nullable<string>;
  requesterId: Nullable<string>;
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
          requesterId,
          pageSize,
        },
      ),
    queryFn: async () => {
      if (!namespaceId) {
        return Promise.reject(new Error("namespaceId not provided"));
      }

      if (!pipelineId) {
        return Promise.reject(new Error("pipelineId not provided"));
      }

      if (!pipelineRunId) {
        return Promise.reject(new Error("pipelineRunId not provided"));
      }

      const client = getInstillAPIClient({
        accessToken: accessToken ?? undefined,
      });

      const data =
        await client.pipeline.trigger.listPaginatedNamespacePipelineComponentRuns(
          {
            namespaceId,
            pipelineId,
            pipelineRunId,
            pageSize: pageSize ?? env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
            view: view ?? "VIEW_BASIC",
            page: page ?? undefined,
            orderBy: orderBy ?? undefined,
            filter: filter ?? undefined,
            requesterId: requesterId ?? undefined,
          },
        );

      return Promise.resolve(data);
    },
    enabled,
  });
}
