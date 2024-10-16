import { useQuery } from "@tanstack/react-query";

import type { Nullable } from "../../type";
import { env } from "../../../server";
import { listModelDefinitionsQuery } from "../../vdp-sdk";

export function useModelDefinitions({
  accessToken,
  enabled,
}: {
  accessToken: Nullable<string>;
  enabled: boolean;
}) {
  return useQuery({
    queryKey: ["model-definitions"],
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const definitions = await listModelDefinitionsQuery({
        pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
        nextPageToken: null,
        accessToken,
      });

      return Promise.resolve(definitions);
    },
    enabled,
  });
}
