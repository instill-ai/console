import { useQuery } from "@tanstack/react-query";

import type { Nullable } from "../../type";
import { env } from "../../../server";
import { listOperatorDefinitionsQuery } from "../../vdp-sdk";

export function useOperatorDefinitions({
  accessToken,
  enabled,
  retry,
}: {
  accessToken: Nullable<string>;
  enabled: boolean;
  retry?: false | number;
}) {
  return useQuery({
    queryKey: ["operator-definitions"],
    queryFn: async () => {
      const operatorDefinitions = await listOperatorDefinitionsQuery({
        pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
        nextPageToken: null,
        accessToken,
        filter: null,
      });

      return Promise.resolve(operatorDefinitions);
    },
    enabled,
    retry: retry === false ? false : retry ? retry : 3,
  });
}
