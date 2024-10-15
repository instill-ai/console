"use client";

import { useQuery } from "@tanstack/react-query";

import { env } from "../../../../server";
import { Nullable } from "../../../type";
import { listApiTokensQuery } from "../../../vdp-sdk";
import { getUseApiTokensQueryKey } from "./server";

export function useApiTokens({
  accessToken,
  enabled,
}: {
  accessToken: Nullable<string>;
  enabled: boolean;
}) {
  const queryKey = getUseApiTokensQueryKey();
  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const tokens = await listApiTokensQuery({
        pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
        nextPageToken: null,
        accessToken,
      });

      return Promise.resolve(tokens);
    },
    enabled,
  });
}
