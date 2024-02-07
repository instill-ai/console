import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteOrganizationMutation, Organization } from "../../vdp-sdk";
import type { Nullable } from "../../type";

export function useDeleteOrganization() {
  const queryClient = useQueryClient();
  return useMutation(
    async ({
      organizationName,
      accessToken,
    }: {
      organizationName: Nullable<string>;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("AccessToken not provided"));
      }
      if (!organizationName) {
        return Promise.reject(new Error("Organization Name not provided"));
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
}
