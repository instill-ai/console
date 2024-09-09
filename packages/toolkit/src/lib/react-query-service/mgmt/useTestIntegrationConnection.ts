import { useMutation /* , useQueryClient */ } from "@tanstack/react-query";

import type { Nullable } from "../../type";
import { getInstillAPIClient } from "../../vdp-sdk";

export function useTestIntegrationConnection() {
  //const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      namespaceId,
      connectionId,
      accessToken,
    }: {
      namespaceId: string;
      connectionId: string;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillAPIClient({ accessToken });

      const result = await client.core.integration.testIntegrationConnection({
        namespaceId,
        connectionId,
      });

      return Promise.resolve(result);
    },
    onSuccess: (/* result */) => {
      /* queryClient.setQueryData<AuthenticatedUser>(
        ["authenticated-user"],
        newUser,
      ); */
    },
  });
}
