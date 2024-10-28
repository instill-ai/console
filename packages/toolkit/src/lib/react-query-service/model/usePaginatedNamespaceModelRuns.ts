"use client";

import type { Nullable, ResourceView } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { env } from "../../../server";
import { getInstillModelAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function usePaginatedNamespaceModelRuns({
  namespaceId,
  modelId,
  accessToken,
  enabled,
  view = "VIEW_BASIC",
  pageSize,
  page,
  orderBy,
  filter,
  requesterUid,
}: {
  namespaceId: Nullable<string>;
  modelId: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  view: Nullable<ResourceView>;
  pageSize: Nullable<number>;
  page: Nullable<number>;
  orderBy: Nullable<string>;
  filter: Nullable<string>;
  requesterUid: Nullable<string>;
}) {
  return useQuery({
    queryKey: queryKeyStore.model.getNamespaceModelRunsQueryKey({
      namespaceId,
      modelId,
      requesterUid,
      accessToken,
      view,
      pageSize,
      page,
      orderBy,
      filter,
    }),
    queryFn: async () => {
      if (!namespaceId) {
        return Promise.reject(new Error("namespaceId not provided"));
      }

      if (!modelId) {
        return Promise.reject(new Error("modelId not provided"));
      }

      const client = getInstillModelAPIClient({
        accessToken: accessToken ?? undefined,
      });

      const data = await client.model.listModelRuns({
        namespaceId,
        modelId,
        view: view ?? "VIEW_BASIC",
        pageSize: pageSize || env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
        page: page || 0,
        orderBy: orderBy ?? undefined,
        filter: filter ?? undefined,
        requesterUid: requesterUid ?? undefined,
      });

      return Promise.resolve(data);
    },
    enabled,
  });
}
