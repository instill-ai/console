import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteUserPipelineMutation,
  deleteUserSecretMutation,
  type Pipeline,
} from "../../vdp-sdk";
import type { Nullable } from "../../type";
import { getUseUserSecretQueryKey } from "./use-user-secret/server";

export function useDeleteUserSecret() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      secretName,
      accessToken,
    }: {
      secretName: string;
      accessToken: Nullable<string>;
    }) => {
      try {
        if (!accessToken) {
          throw new Error("accessToken not provided");
        }

        await deleteUserSecretMutation({ secretName, accessToken });

        return Promise.resolve(secretName);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    onSuccess: (secretName) => {
      const useUserSecretQueryKey = getUseUserSecretQueryKey(secretName);
      queryClient.removeQueries({
        queryKey: useUserSecretQueryKey,
        exact: true,
      });
    },
  });
}
