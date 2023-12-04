import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import {
  AcceptOrganizationMembershipPayload,
  acceptOrganizationMembershipAction,
} from "../../vdp-sdk/organization/actions";

export const useAcceptOrganizationMembership = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({
      payload,
      accessToken,
      organizationName,
      userName,
    }: {
      payload: AcceptOrganizationMembershipPayload;
      accessToken: Nullable<string>;
      organizationName: string;
      userName: string;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("AccessToken not provided"));
      }

      const membership = await acceptOrganizationMembershipAction({
        payload,
        accessToken,
        organizationName,
        userName,
      });

      return Promise.resolve({ membership });
    }
  );
};
