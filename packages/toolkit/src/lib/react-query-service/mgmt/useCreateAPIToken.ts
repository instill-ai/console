"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { APIToken, CreateAPITokenRequest, Nullable } from "instill-sdk";

import { getInstillAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useCreateAPIToken() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: CreateAPITokenRequest;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken is required"));
      }

      const client = getInstillAPIClient({ accessToken });

      const res = await client.mgmt.token.createAPIToken(payload);

      return Promise.resolve(res.token);
    },
    onSuccess: (token) => {
      queryClient.invalidateQueries({
        queryKey: queryKeyStore.mgmt.getUseAPITokensQueryKey(),
      });
      queryClient.setQueryData<APIToken>(
        queryKeyStore.mgmt.getUseAPITokenQueryKey({
          tokenId: token.id,
        }),
        token,
      );
    },
  });
}
