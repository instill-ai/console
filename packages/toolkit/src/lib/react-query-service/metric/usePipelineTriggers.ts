"use client";

import type { Nullable } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { env } from "../../../server";
import { getInstillAPIClient } from "../../vdp-sdk";

export function usePipelineTriggers({
  enabled,
  accessToken,
  filter,
  filterId,
}: {
  enabled: boolean;
  accessToken: Nullable<string>;
  filter: Nullable<string>;
  filterId: Nullable<string>;
}) {
  const queryKey = ["metrics", "pipelines", "triggers"];

  if (filterId) {
    queryKey.push(filterId);
  }

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillAPIClient({ accessToken });

      const triggers = await client.core.metric.listPipelineTriggers({
        pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
        filter: filter ?? undefined,
        enablePagination: false,
      });

      return Promise.resolve(triggers);
    },
    enabled,
  });
}
