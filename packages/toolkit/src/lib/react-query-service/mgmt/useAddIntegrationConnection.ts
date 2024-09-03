import { useMutation /* , useQueryClient */ } from "@tanstack/react-query";
import { AddIntegrationRequest } from "instill-sdk";

import type { Nullable } from "../../type";
import { getInstillAPIClient } from "../../vdp-sdk";

export function useAddIntegrationConnection() {
  //const queryClient = useQueryClient();

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
    onSuccess: (/* connection */) => {
      // TODO: update the connected integrations list
      /* queryClient.setQueryData<ApiToken[]>(["api-tokens"], (old) =>
        old ? [...old, token] : [token],
      );
      queryClient.setQueryData<ApiToken>(["api-tokens", token.name], token); */
    },
  });
}
