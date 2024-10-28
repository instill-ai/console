import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateIntegrationConnectionRequest } from "instill-sdk";

import type { Nullable } from "../../type";
import { getInstillAPIClient } from "../../sdk-helper";

export function useCreateIntegrationConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: CreateIntegrationConnectionRequest;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillAPIClient({ accessToken });

      const data =
        await client.core.integration.createIntegrationConnection(payload);

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
