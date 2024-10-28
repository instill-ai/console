"use client";

import type {
  Nullable,
  Organization,
  UpdateOrganizationRequest,
} from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../vdp-sdk";
import { getUseOrganizationQueryKey } from "./use-organization/server";
import { getUseOrganizationsQueryKey } from "./use-organizations/server";

export function useUpdateOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: UpdateOrganizationRequest;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("AccessToken not provided"));
      }

      const client = getInstillAPIClient({
        accessToken,
      });

      const organization =
        await client.core.organization.updateOrganization(payload);

      return Promise.resolve({ organization });
    },
    onSuccess: ({ organization }) => {
      const organizationsQueryKey = getUseOrganizationsQueryKey();
      queryClient.setQueryData<Organization[]>(organizationsQueryKey, (old) =>
        old ? [...old, organization] : [organization],
      );
      const organizationQueryKey = getUseOrganizationQueryKey(organization.id);
      queryClient.setQueryData<Organization>(
        organizationQueryKey,
        organization,
      );
    },
  });
}
