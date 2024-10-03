import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddIntegrationRequest } from "instill-sdk";

import type { Nullable } from "../../type";
import { getInstillAPIClient } from "../../vdp-sdk";

export function useAddIntegrationConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: AddIntegrationRequest;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillAPIClient({ accessToken });

      const data = await client.core.integration.addIntegration(payload);

      return Promise.resolve(data);
    },
    onSuccess: (connection) => {
      queryClient.invalidateQueries({
        queryKey: [
          "integration-connections",
          connection.namespaceId,
          "infinite",
        ],
      });
    },
  });
}
