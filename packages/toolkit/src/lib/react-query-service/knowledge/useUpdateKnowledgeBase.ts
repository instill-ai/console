"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import { getInstillAPIClient } from "../../vdp-sdk";
import { UpdateKnowledgeBaseRequest } from "../../../../../sdk/src/vdp/artifact/types";

export function useUpdateKnowledgeBase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: UpdateKnowledgeBaseRequest;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }
      const client = getInstillAPIClient({ accessToken });
      const updatedKnowledgeBase = await client.vdp.artifact.updateKnowledgeBase(payload);
      return Promise.resolve({ updatedKnowledgeBase });
    },
    onSuccess: async ({ updatedKnowledgeBase }) => {
      queryClient.invalidateQueries({ queryKey: ["knowledgeBases", updatedKnowledgeBase.ownerName] });
    },
  });
}