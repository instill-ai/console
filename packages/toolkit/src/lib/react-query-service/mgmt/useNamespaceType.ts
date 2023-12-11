import { useQuery } from "@tanstack/react-query";
import { checkNamespace } from "../../vdp-sdk";
import type { Nullable } from "../../type";

export const useNamespaceType = ({
  namespace,
  accessToken,
  enabled,
  retry,
}: {
  namespace: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  /**
   * - Default is 3
   * - Set to false to disable retry
   */
  retry?: false | number;
}) => {
  let enabledQuery = false;

  if (namespace && enabled) {
    enabledQuery = true;
  }

  return useQuery(
    ["namespaces", namespace],
    async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      if (!namespace) {
        return Promise.reject(new Error("namespace not provided"));
      }

      const type = await checkNamespace({
        id: namespace,
        accessToken,
      });

      return Promise.resolve(type);
    },
    {
      enabled: enabledQuery,
      retry: retry === false ? false : retry ? retry : 3,
    }
  );
};
