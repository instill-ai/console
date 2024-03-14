import { useQuery } from "@tanstack/react-query";
import { env } from "../../../server";
import { listModelDefinitionsQuery } from "../../vdp-sdk";
import type { Nullable } from "../../type";

export function useModelDefinitions({
  accessToken,
  enabled,
  retry,
}: {
  accessToken: Nullable<string>;
  enabled: boolean;
  retry?: false | number;
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
    retry: retry === false ? false : retry ? retry : 3,
  });
}
