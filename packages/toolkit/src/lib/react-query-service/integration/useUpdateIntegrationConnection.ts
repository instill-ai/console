import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  IntegrationConnection,
  UpdateIntegrationConnectionRequest,
} from "instill-sdk";

import type { Nullable } from "../../type";
import { getInstillAPIClient } from "../../sdk-helper";

export function useUpdateIntegrationConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: UpdateIntegrationConnectionRequest;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillAPIClient({ accessToken });

      const connection =
        await client.core.integration.updateIntegrationConnection(payload);

      return Promise.resolve(connection);
    },
    onSuccess: (connection) => {
      queryClient.setQueryData<IntegrationConnection>(
        [
          "integration-connection",
          connection.id,
          connection.namespaceId,
          "VIEW_FULL",
        ],
        connection,
      );
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
