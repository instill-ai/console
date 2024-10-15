import { useQuery } from "@tanstack/react-query";

import type { Nullable } from "../../type";
import { env } from "../../../server";
import { getInstillAPIClient } from "../../vdp-sdk";

export function useUsers({
  accessToken,
  enabled,
}: {
  accessToken: Nullable<string>;
  enabled: boolean;
}) {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillAPIClient({ accessToken });

      const users = await client.core.user.listUsers({
        pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
        enablePagination: false,
      });

      return Promise.resolve(users);
    },
    enabled,
  });
}
