import { useQuery } from "@tanstack/react-query";

import type { Nullable } from "../../type";
import { getInstillAPIClient } from "../../vdp-sdk";

export function useApiToken({
  tokenName,
  accessToken,
  enabled,
}: {
  tokenName: string;
  accessToken: Nullable<string>;
  enabled: boolean;
}) {
  return useQuery({
    queryKey: ["api-tokens", tokenName],
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillAPIClient({ accessToken });

      const token = await client.core.token.getApiToken({
        tokenName,
      });

      return Promise.resolve(token);
    },
    enabled,
  });
}
