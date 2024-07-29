"use client";

import { useQuery } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import { getInstillAPIClient } from "../../vdp-sdk";
import { ListKnowledgeBaseFilesRequest } from "../../../../../sdk/src/vdp/artifact/types";

export function useListKnowledgeBaseFiles() {
  return useQuery<
    any,
    Error,
    any,
    [string, ListKnowledgeBaseFilesRequest & { accessToken: Nullable<string> }]
  >({
    queryKey: ["knowledgeBaseFiles"],
    queryFn: async ({ queryKey }) => {
      const [, { ownerId, kbId, accessToken }] = queryKey;
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }
      const client = getInstillAPIClient({ accessToken });
      return client.vdp.artifact.listKnowledgeBaseFiles({ ownerId, kbId });
    },
  });
}