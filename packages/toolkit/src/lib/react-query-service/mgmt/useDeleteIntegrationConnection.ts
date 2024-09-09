import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Nullable } from "../../type";
import { getInstillAPIClient } from "../../vdp-sdk";

export function useDeleteIntegrationConnection() {
  const queryClient = useQueryClient();

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

      const result = await client.core.integration.deleteIntegrationConnection({
        namespaceId,
        connectionId,
      });

      return Promise.resolve(result);
    },
    onSuccess: ({ connectionId, namespaceId }) => {
      queryClient.invalidateQueries({
        queryKey: [
          "integration-connection",
          connectionId,
          namespaceId,
          "VIEW_FULL",
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ["integration-connections", namespaceId, "infinite"],
      });
    },
  });
}
