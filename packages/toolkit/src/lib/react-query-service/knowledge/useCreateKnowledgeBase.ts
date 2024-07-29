"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import { getInstillArtifactAPIClient } from "../../vdp-sdk";
import { CreateKnowledgeBaseRequest, KnowledgeBase } from "../../../../../sdk/src/vdp/artifact/types";

export function useCreateKnowledgeBase() {
  const queryClient = useQueryClient();
  return useMutation<
    KnowledgeBase,
    Error,
    { payload: CreateKnowledgeBaseRequest; accessToken: Nullable<string> }
  >({
    mutationFn: async ({ payload, accessToken }) => {
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }
      const client = getInstillArtifactAPIClient({ accessToken });
      const knowledgeBase = await client.artifact.createKnowledgeBase(payload);
      return knowledgeBase;
    },
    onSuccess: (knowledgeBase) => {
      queryClient.invalidateQueries({ queryKey: ["knowledgeBases", knowledgeBase.ownerName] });
    },
  });
}