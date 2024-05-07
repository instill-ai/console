import { useQuery } from "@tanstack/react-query";
import { env } from "../../../server";
import { Visibility, listModelsQuery } from "../../vdp-sdk";
import type { Nullable } from "../../type";

export function useModels({
  accessToken,
  enabled,
  retry,
  filter,
  visibility,
}: {
  accessToken: Nullable<string>;
  enabled: boolean;
  retry?: false | number;
  filter: Nullable<string>;
  visibility: Nullable<Visibility>;
}) {
  const queryKey = ["models"];

  if (filter) {
    queryKey.push(filter);
  }

  if (visibility) {
    queryKey.push(visibility);
  }

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const models = await listModelsQuery({
        pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
        nextPageToken: null,
        accessToken,
        filter,
        visibility,
      });

      return Promise.resolve(models);
    },
    enabled,
    retry: retry === false ? false : retry ? retry : 3,
  });
}
