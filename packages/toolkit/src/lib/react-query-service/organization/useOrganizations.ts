import { useQuery } from "@tanstack/react-query";

import type { Nullable } from "../../type";
import { env } from "../../../server";
import { listOrganizationsQuery } from "../../vdp-sdk";

export function useOrganizations({
  accessToken,
  enabled,
  retry,
}: {
  accessToken: Nullable<string>;
  enabled: boolean;
  retry?: false | number;
}) {
  return useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const tokens = await listOrganizationsQuery({
        pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
        nextPageToken: null,
        accessToken,
        filter: null,
      });

      return Promise.resolve(tokens);
    },
    enabled,
    retry: retry === false ? false : retry ? retry : 3,
  });
}
