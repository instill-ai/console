import { useQuery } from "@tanstack/react-query";
import { ResourceView } from "instill-sdk";

import type { Nullable } from "../../type";
import { env } from "../../../server";
import { getInstillModelAPIClient } from "../../vdp-sdk";

export function usePaginatedModelRuns({
  modelName,
  accessToken,
  enabled,
  retry,
  view = "VIEW_BASIC",
  pageSize,
  page,
  orderBy,
  filter,
  requesterUid,
}: {
  modelName: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  retry?: false | number;
  view?: ResourceView;
  pageSize?: number;
  page?: number;
  orderBy?: string;
  filter?: string;
  requesterUid?: string;
}) {
  const queryKey = [
    "model-runs",
    modelName,
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
      if (!modelName) {
        return Promise.reject(new Error("modelName not provided"));
      }

      const client = getInstillModelAPIClient({
        accessToken: accessToken ?? undefined,
      });

      const data = await client.model.listModelRunsQuery({
        modelName,
        view,
        pageSize: pageSize || env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
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
