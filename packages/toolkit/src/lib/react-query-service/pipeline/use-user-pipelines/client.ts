import { useQuery } from "@tanstack/react-query";

import { fetchUserPipelines } from "./server";
import { Visibility } from "../../../vdp-sdk";
import { Nullable } from "../../../type";

// This is a public API, we won't block unauth users from accessing this

export function useUserPipelines({
  userName,
  enabled,
  accessToken,
  retry,
  filter,
  visibility,
  disabledViewFull,
  pageSize,
}: {
  userName: Nullable<string>;
  enabled: boolean;
  accessToken: Nullable<string>;
  filter: Nullable<string>;
  visibility: Nullable<Visibility>;
  disabledViewFull?: boolean;
  pageSize?: number;
  /**
   * - Default is 3
   * - Set to false to disable retry
   */
  retry?: false | number;
}) {
  let enableQuery = false;

  if (userName && enabled) {
    enableQuery = true;
  }

  return useQuery({
    queryKey: ["pipelines", userName],
    queryFn: async () => {
      try {
        return await fetchUserPipelines({
          userName,
          accessToken,
          filter,
          visibility,
          disabledViewFull,
          pageSize,
        });
      } catch (error) {
        return Promise.reject(error);
      }
    },
    enabled: enableQuery,
    retry: retry === false ? false : retry ? retry : 3,
  });
}
