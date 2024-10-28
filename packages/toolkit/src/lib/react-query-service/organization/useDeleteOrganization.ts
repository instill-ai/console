"use client";

import type { Nullable, Organization } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../sdk-helper";
import { getUseOrganizationsQueryKey } from "./use-organizations/server";

export function useDeleteOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      organizationId,
      accessToken,
    }: {
      organizationId: Nullable<string>;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("AccessToken not provided"));
      }

      if (!organizationId) {
        return Promise.reject(new Error("organizationId not provided"));
      }

      const client = getInstillAPIClient({
        accessToken,
      });

      await client.core.organization.deleteOrganization({
        organizationId,
      });

      return Promise.resolve(organizationId);
    },
    onSuccess: (organizationId) => {
      const organizationsQueryKey = getUseOrganizationsQueryKey();
      queryClient.setQueryData<Organization[]>(organizationsQueryKey, (old) =>
        old ? old.filter((e) => e.id !== organizationId) : [],
      );
    },
  });
}
