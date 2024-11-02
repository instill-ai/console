"use client";

import type { Nullable } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useDeleteAPIToken() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      tokenId,
      accessToken,
    }: {
      tokenId: string;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken is required"));
      }

      const client = getInstillAPIClient({ accessToken });

      await client.core.token.deleteAPIToken({ tokenId });

      return Promise.resolve(tokenId);
    },
    onSuccess: (tokenId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeyStore.mgmt.getUseAPITokensQueryKey(),
      });
      queryClient.removeQueries({
        queryKey: queryKeyStore.mgmt.getUseAPITokenQueryKey({
          tokenId,
        }),
      });
    },
  });
}
