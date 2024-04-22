import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Secret,
  deleteUserPipelineMutation,
  deleteUserSecretMutation,
  type Pipeline,
} from "../../vdp-sdk";
import type { Nullable } from "../../type";
import { getUseUserSecretQueryKey } from "./use-user-secret/server";
import { getUseUserSecretsQueryKey } from "./use-user-secrets/server";

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

      const secretNameFragment = secretName.split("/");
      const entityName = `${secretNameFragment[0]}/${secretNameFragment[1]}`;

      const useUserSecretsQueryKey = getUseUserSecretsQueryKey(entityName);
      queryClient.setQueryData<Secret[]>(useUserSecretsQueryKey, (old) => {
        return old ? old.filter((data) => data.name !== secretName) : [];
      });
    },
  });
}
