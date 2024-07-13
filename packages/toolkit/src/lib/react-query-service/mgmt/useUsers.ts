import { useQuery } from "@tanstack/react-query";

import type { Nullable } from "../../type";
import { env } from "../../../server";
import { getInstillAPIClient } from "../../vdp-sdk";

export function useUsers({
  accessToken,
  enabled,
  retry,
}: {
  accessToken: Nullable<string>;
  enabled: boolean;
  retry?: false | number;
}) {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillAPIClient({ accessToken, publicAccess: false });

      const users = await client.core.user.listUsers({
        pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
        enablePagination: false,
      });

      return Promise.resolve(users);
    },
    enabled,
    retry: retry === false ? false : retry ? retry : 3,
  });
}
