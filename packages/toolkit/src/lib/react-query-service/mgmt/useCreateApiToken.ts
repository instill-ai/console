import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createApiTokenMutation,
  type ApiToken,
  type CreateApiTokenPayload,
} from "../../vdp-sdk";
import type { Nullable } from "../../type";

export function useCreateApiToken() {
  const queryClient = useQueryClient();
  return useMutation(
    async ({
      payload,
      accessToken,
    }: {
      payload: CreateApiTokenPayload;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const token = await createApiTokenMutation({
        payload,
        accessToken,
      });

      return Promise.resolve({ token });
    },
    {
      onSuccess: ({ token }) => {
        queryClient.setQueryData<ApiToken[]>(["api-tokens"], (old) =>
          old ? [...old, token] : [token]
        );
        queryClient.setQueryData<ApiToken>(["api-tokens", token.name], token);
      },
    }
  );
}
