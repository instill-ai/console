"use client";

import type { Nullable, ResourceView } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { env } from "../../../server";
import { getInstillAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function usePaginatedNamespacePipelineRuns({
  namespaceId,
  pipelineId,
  accessToken,
  enabled,
  view = "VIEW_BASIC",
  pageSize,
  page,
  orderBy,
  filter,
  requesterId,
}: {
  namespaceId: Nullable<string>;
  pipelineId: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  view: Nullable<ResourceView>;
  pageSize: Nullable<number>;
  page: Nullable<number>;
  orderBy: Nullable<string>;
  filter: Nullable<string>;
  requesterId: Nullable<string>;
}) {
  return useQuery({
    queryKey:
      queryKeyStore.pipeline.getUsePaginatedNamespacePipelineRunsQueryKey({
        namespaceId,
        pipelineId,
        requesterId,
        accessToken,
        view,
        pageSize,
        page,
        orderBy,
        filter,
      }),
    queryFn: async () => {
      if (!namespaceId) {
        return Promise.reject(new Error("namespaceId is required"));
      }

      if (!pipelineId) {
        return Promise.reject(new Error("pipelineId is required"));
      }

      const client = getInstillAPIClient({
        accessToken: accessToken ?? undefined,
      });

      const data =
        await client.pipeline.trigger.listPaginatedNamespacePipelineRuns({
          namespaceId,
          pipelineId,
          pageSize: pageSize ?? env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
          view: view ?? "VIEW_BASIC",
          page: page ?? undefined,
          orderBy: orderBy ?? undefined,
          filter: filter ?? undefined,
          requesterId: requesterId ?? undefined,
        });

      return Promise.resolve(data);
    },
    enabled,
  });
}
