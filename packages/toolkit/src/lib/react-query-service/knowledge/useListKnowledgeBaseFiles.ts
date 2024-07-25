"use client";

import { useQuery } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import { getInstillArtifactAPIClient } from "../../vdp-sdk";
import { ListKnowledgeBaseFilesRequest } from "../../../../../sdk/src/vdp/artifact/types";

export function useListKnowledgeBaseFiles() {
  return useQuery({
    queryKey: ["knowledgeBaseFiles"],
    queryFn: async ({ ownerId, kbId, accessToken }: ListKnowledgeBaseFilesRequest & { accessToken: Nullable<string> }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }
      const client = getInstillArtifactAPIClient({ accessToken });
      const files = await client.vdp.knowledgeBase.listKnowledgeBaseFiles({ ownerId, kbId });
      return Promise.resolve(files);
    },
  });
}