"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import { getInstillArtifactAPIClient } from "../../vdp-sdk";
import { CreateKnowledgeBaseRequest } from "../../../../../sdk/src/vdp/artifact/types";

export function useCreateKnowledgeBase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: CreateKnowledgeBaseRequest;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }
      const client = getInstillArtifactAPIClient({ accessToken });
      const knowledgeBase = await client.vdp.knowledgeBase.createKnowledgeBase(payload);
      return Promise.resolve({ knowledgeBase, namespaceName: payload.ownerId });
    },
    onSuccess: async ({ knowledgeBase, namespaceName }) => {
      queryClient.invalidateQueries({ queryKey: ["knowledgeBases", namespaceName] });
    },
  });
}