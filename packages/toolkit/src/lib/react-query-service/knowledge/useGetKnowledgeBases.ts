"use client";

import { useQuery } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import { getInstillAPIClient } from "../../vdp-sdk";

export function useGetKnowledgeBases() {
  return useQuery({
    queryKey: ["knowledgeBases"],
    queryFn: async ({ accessToken }: { accessToken: Nullable<string> }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillAPIClient({ accessToken });

      const knowledgeBases = await client.vdp.artifact.listKnowledgeBases();

      return Promise.resolve(knowledgeBases);
    },
  });
}