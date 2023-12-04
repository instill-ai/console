import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteOrganizationMutation, Organization } from "../../vdp-sdk";
import type { Nullable } from "../../type";

export const useDeleteOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({
      organizationName,
      accessToken,
    }: {
      organizationName: string;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("AccessToken not provided"));
      }

      await deleteOrganizationMutation({ organizationName, accessToken });

      return Promise.resolve(organizationName);
    },
    {
      onSuccess: (organizationName) => {
        queryClient.setQueryData<Organization[]>(["organizations"], (old) =>
          old ? old.filter((e) => e.id !== organizationName) : []
        );
      },
    }
  );
};
