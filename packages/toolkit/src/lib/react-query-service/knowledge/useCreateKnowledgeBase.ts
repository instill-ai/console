import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Nullable } from "@instill-ai/toolkit";

import { getInstillAPIClient } from "../../vdp-sdk";
import { KnowledgeBase } from "./types";

export function useCreateKnowledgeBase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      payload,
      ownerId,
      accessToken,
    }: {
      payload: {
        name: string;
        description?: string;
        tags?: string[];
      };
      ownerId: string;
      accessToken: Nullable<string>;
    }): Promise<KnowledgeBase> => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }
      const client = getInstillAPIClient({ accessToken });
      const response = await client.vdp.artifact.createKnowledgeBase({
        ownerId,
        payload,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledgeBases"] });
    },
  });
}
