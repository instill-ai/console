import { useQuery } from "@tanstack/react-query";

import type { Nullable } from "../../type";
import { env } from "../../../server";
import { listModelRunsQuery } from "../../vdp-sdk";

export function usePaginatedModelRuns({
  modelName,
  accessToken,
  enabled,
  retry,
  fullView,
  pageSize,
  page,
  orderBy,
  filter,
}: {
  modelName: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  retry?: false | number;
  fullView?: boolean;
  pageSize?: number;
  page?: number;
  orderBy?: string;
  filter?: string;
}) {
  const queryKey = [
    "model-runs",
    modelName,
    "paginated",
    accessToken ? "withAuth" : "unAuth",
    fullView ? "VIEW_FULL" : "VIEW_BASIC",
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
      if (!modelName) {
        return Promise.reject(new Error("modelName not provided"));
      }

      const data = await listModelRunsQuery({
        accessToken,
        modelName,
        fullView: !!fullView,
        pageSize: pageSize || env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
        page: page || 0,
        orderBy: orderBy || null,
        filter: filter || null,
      });

      return Promise.resolve(data);
    },
    enabled,
    retry: retry === false ? false : retry ? retry : 3,
  });
}
