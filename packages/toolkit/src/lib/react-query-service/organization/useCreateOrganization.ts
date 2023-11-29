import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Nullable } from "../../type";
import {
  CreateOrganizationPayload,
  Organization,
  createOrganizationMutation,
} from "../../vdp-sdk";

export const useCreateOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({
      payload,
      accessToken,
    }: {
      payload: CreateOrganizationPayload;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const organization = await createOrganizationMutation({
        payload,
        accessToken,
      });

      return Promise.resolve({ organization });
    },
    {
      onSuccess: ({ organization }) => {
        queryClient.setQueryData<Organization[]>(["organization"], (old) =>
          old ? [...old, organization] : [organization]
        );
        queryClient.setQueryData<Organization>(
          ["organization", organization],
          organization
        );
      },
    }
  );
};
