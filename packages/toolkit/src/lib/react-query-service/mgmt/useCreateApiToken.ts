"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiToken, CreateApiTokenRequest } from "instill-sdk";

import type { Nullable } from "../../type";
import { getInstillAPIClient } from "../../vdp-sdk";

export function useCreateApiToken() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: CreateApiTokenRequest;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillAPIClient({ accessToken });

      const token = await client.core.token.createApiToken(payload);

      return Promise.resolve({ token });
    },
    onSuccess: ({ token }) => {
      queryClient.setQueryData<ApiToken[]>(["api-tokens"], (old) =>
        old ? [...old, token] : [token],
      );
      queryClient.setQueryData<ApiToken>(["api-tokens", token.name], token);
    },
  });
}
