import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteApiTokenMutation, type ApiToken } from "../../vdp-sdk";
import type { Nullable } from "../../type";

export const useDeleteApiToken = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({
      tokenName,
      accessToken,
    }: {
      tokenName: string;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      await deleteApiTokenMutation({ tokenName, accessToken });
      return Promise.resolve(tokenName);
    },
    {
      onSuccess: (tokenName) => {
        queryClient.setQueryData<ApiToken[]>(["api-tokens"], (old) =>
          old ? old.filter((e) => e.name !== tokenName) : []
        );
        queryClient.removeQueries(["api-tokens", tokenName], { exact: true });
      },
    }
  );
};
