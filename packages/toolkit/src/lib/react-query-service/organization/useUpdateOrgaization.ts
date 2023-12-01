import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Nullable } from "../../type";
import {
  CreateOrganizationPayload,
  Organization,
  updateOrganizationMutation,
} from "../../vdp-sdk";

export const useUpdateOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({
      payload,
      accessToken,
      organizationName,
    }: {
      payload: CreateOrganizationPayload;
      accessToken: Nullable<string>;
      organizationName: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("AccessToken not provided"));
      }

      const organization = await updateOrganizationMutation({
        payload,
        accessToken,
        organizationName,
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
