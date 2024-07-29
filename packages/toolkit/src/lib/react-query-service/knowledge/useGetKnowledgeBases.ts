"use client";

import { useQuery } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import { getInstillAPIClient } from "../../vdp-sdk";

export function useGetKnowledgeBases() {
  return useQuery<any, Error, any, [string, { accessToken: Nullable<string> }]>({
    queryKey: ["knowledgeBases"],
    queryFn: async ({ queryKey }) => {
      const [, { accessToken }] = queryKey;
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }
      const client = getInstillAPIClient({ accessToken });
      return client.vdp.artifact.listKnowledgeBases();
    },
  });
}