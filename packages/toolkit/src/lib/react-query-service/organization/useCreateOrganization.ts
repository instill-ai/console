"use client";

import type {
  CreateOrganizationRequest,
  Nullable,
  Organization,
} from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../sdk-helper";
import { getUseOrganizationQueryKey } from "./use-organization/server";
import { getUseOrganizationsQueryKey } from "./use-organizations/server";
import { getUseUserMembershipsQueryKey } from "./useUserMemberships";

export function useCreateOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: CreateOrganizationRequest;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillAPIClient({
        accessToken,
      });

      const organization =
        await client.core.organization.createOrganization(payload);

      return Promise.resolve({ organization });
    },
    onSuccess: ({ organization }) => {
      queryClient.invalidateQueries({
        queryKey: getUseUserMembershipsQueryKey(organization.owner.id),
      });

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
