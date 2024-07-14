import { useQuery } from "@tanstack/react-query";

import { Nullable } from "../../../type";
import { Visibility } from "../../../vdp-sdk";
import {
  fetchNamespacePipelines,
  getUseNamespacePipelinesQueryKey,
} from "./server";

// This is a public API, we won't block unauth users from accessing this

export function useNamespacePipelines({
  namespaceName,
  enabled,
  accessToken,
  retry,
  filter,
  visibility,
  disabledViewFull,
  pageSize,
}: {
  namespaceName: Nullable<string>;
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

  if (namespaceName && enabled) {
    enableQuery = true;
  }

  const queryKey = getUseNamespacePipelinesQueryKey(namespaceName);

  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      try {
        return await fetchNamespacePipelines({
          namespaceName,
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
