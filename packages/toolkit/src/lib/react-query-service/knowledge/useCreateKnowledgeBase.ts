"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import { getInstillAPIClient } from "../../vdp-sdk";
import { CreateKnowledgeBaseRequest } from "../../../../../sdk/src/vdp/artifact/types";

export function useCreateKnowledgeBase() {
  const queryClient = useQueryClient();
  return useMutation<
    { knowledgeBase: any; namespaceName: string },
    Error,
    { payload: CreateKnowledgeBaseRequest; accessToken: Nullable<string> }
  >({
    mutationFn: async ({ payload, accessToken }) => {
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }
      const client = getInstillAPIClient({ accessToken });
      const knowledgeBase = await client.vdp.artifact.createKnowledgeBase(payload);
      return { knowledgeBase, namespaceName: payload.ownerId };
    },
    onSuccess: ({ knowledgeBase, namespaceName }) => {
      queryClient.invalidateQueries({ queryKey: ["knowledgeBases", namespaceName] });
    },
  });
}