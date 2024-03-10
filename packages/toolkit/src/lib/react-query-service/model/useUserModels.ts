import { useQuery } from "@tanstack/react-query";
import { env } from "../../utility";
import { listUserModelsQuery } from "../../vdp-sdk";
import type { Nullable } from "../../type";

export function useUserModels({
  userName,
  accessToken,
  enabled,
  retry,
}: {
  userName: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;

  retry?: false | number;
}) {
  let enableQuery = false;

  if (userName && enabled) {
    enableQuery = true;
  }

  return useQuery({
    queryKey: ["models", userName],
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      if (!userName) {
        return Promise.reject(new Error("userName not provided"));
      }

      const models = await listUserModelsQuery({
        userName,
        pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
        nextPageToken: null,
        accessToken,
      });

      return Promise.resolve(models);
    },
    enabled: enableQuery,
    retry: retry === false ? false : retry ? retry : 3,
  });
}
