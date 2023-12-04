import { useMutation, useQueryClient } from "@tanstack/react-query";
import { leaveOrganizationMutation } from "../../vdp-sdk";
import type { Nullable } from "../../type";

export const useLeaveOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({
      organizationName,
      userName,
      accessToken,
    }: {
      organizationName: string;
      userName: string;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("AccessToken not provided"));
      }

      await leaveOrganizationMutation({
        organizationName,
        userName,
        accessToken,
      });

      return Promise.resolve(organizationName);
    }
  );
};
