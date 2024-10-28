"use client";

import type { ApiToken, Nullable } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../sdk-helper";

export function useDeleteApiToken() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      tokenName,
      accessToken,
    }: {
      tokenName: string;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillAPIClient({ accessToken });

      await client.core.token.deleteApiToken({ tokenName });

      return Promise.resolve(tokenName);
    },
    onSuccess: (tokenName) => {
      queryClient.setQueryData<ApiToken[]>(["api-tokens"], (old) =>
        old ? old.filter((e) => e.name !== tokenName) : [],
      );
      queryClient.removeQueries({
        queryKey: ["api-tokens", tokenName],
        exact: true,
      });
    },
  });
}
