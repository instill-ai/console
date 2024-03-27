import { useQuery } from "@tanstack/react-query";
import { listUsersQuery } from "../../vdp-sdk";
import type { Nullable } from "../../type";
import { env } from "../../../server";

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

      const users = await listUsersQuery({
        pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
        nextPageToken: null,
        accessToken,
      });

      return Promise.resolve(users);
    },
    enabled,
    retry: retry === false ? false : retry ? retry : 3,
  });
}
