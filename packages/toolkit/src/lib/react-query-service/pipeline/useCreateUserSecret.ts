import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUseUserSecretQueryKey,
  getUseUserSecretsQueryKey,
} from "../../../server";
import {
  type CreateUserSecretPayload,
  type Secret,
  createUserSecretMutation,
} from "../../vdp-sdk";
import type { Nullable } from "../../type";

export function useCreateUserSecret() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      entityName,
      payload,
      accessToken,
    }: {
      entityName: string;
      payload: CreateUserSecretPayload;
      accessToken: Nullable<string>;
    }) => {
      try {
        if (!accessToken) {
          throw new Error("accessToken not provided");
        }

        const secret = await createUserSecretMutation({
          entityName,
          payload,
          accessToken,
        });

        return Promise.resolve({ secret, entityName });
      } catch (error) {
        return Promise.reject(error);
      }
    },
    onSuccess: async ({ secret, entityName }) => {
      const useUserSecretQueryKey = getUseUserSecretQueryKey(secret.name);
      queryClient.setQueryData<Secret>(useUserSecretQueryKey, secret);

      const useUserSecretsQueryKey = getUseUserSecretsQueryKey(entityName);
      queryClient.setQueryData<Secret[]>(useUserSecretsQueryKey, (old) =>
        old ? [...old, secret] : [secret]
      );
    },
  });
}
