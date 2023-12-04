import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Nullable } from "../../type";
import { Organization, updateOrganizationMutation } from "../../vdp-sdk";
import {
  UpdateOrganizationMembershipRolePayload,
  updateOrganizationMembershipRoleAction,
} from "../../vdp-sdk/organization/actions";

export const useUpdateOrganizationMembershipRole = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({
      payload,
      accessToken,
      organizationName,
      userName,
    }: {
      payload: UpdateOrganizationMembershipRolePayload;
      accessToken: Nullable<string>;
      organizationName: string;
      userName: string;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("AccessToken not provided"));
      }

      const membership = await updateOrganizationMembershipRoleAction({
        payload,
        accessToken,
        organizationName,
        userName,
      });

      return Promise.resolve({ membership });
    }
  );
};
