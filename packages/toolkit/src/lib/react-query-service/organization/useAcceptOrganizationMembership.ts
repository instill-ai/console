import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import {
  AcceptOrganizationMembershipPayload,
  acceptOrganizationMembershipAction,
} from "../../vdp-sdk";

export const useAcceptOrganizationMembership = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({
      payload,
      accessToken,
    }: {
      payload: AcceptOrganizationMembershipPayload;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("AccessToken not provided"));
      }

      const membership = await acceptOrganizationMembershipAction({
        payload,
        accessToken,
      });

      return Promise.resolve({ membership });
    }
  );
};
