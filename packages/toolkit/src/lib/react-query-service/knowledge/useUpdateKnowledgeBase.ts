"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import { getInstillAPIClient } from "../../vdp-sdk";
import { UpdateKnowledgeBaseRequest } from "../../../../../sdk/src/vdp/artifact/types";

export function useUpdateKnowledgeBase() {
  const queryClient = useQueryClient();
  return useMutation<
    { updatedKnowledgeBase: any },
    Error,
    { payload: UpdateKnowledgeBaseRequest; accessToken: Nullable<string> }
  >({
    mutationFn: async ({ payload, accessToken }) => {
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }
      const client = getInstillAPIClient({ accessToken });
      const updatedKnowledgeBase = await client.vdp.artifact.updateKnowledgeBase(payload);
      return { updatedKnowledgeBase };
    },
    onSuccess: ({ updatedKnowledgeBase }) => {
      queryClient.invalidateQueries({ queryKey: ["knowledgeBases", updatedKnowledgeBase.ownerName] });
    },
  });
}