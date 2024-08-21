import { useQuery } from "@tanstack/react-query";
import { ComponentType, Nullable } from "instill-sdk";

import { env } from "../../../server";
import { getInstillAPIClient } from "../../vdp-sdk";

export function useComponentDefinitions({
  componentType,
  accessToken,
  enabled,
  retry,
}: {
  componentType: ComponentType | "all";
  accessToken: Nullable<string>;
  enabled: boolean;
  retry?: false | number;
}) {
  return useQuery({
    queryKey: ["component-definitions", componentType],
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillAPIClient({ accessToken });

      const connectorDefinitions =
        await client.vdp.component.listComponentDefinitions({
          pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
          filter:
            componentType !== "all"
              ? `componentType=${componentType}`
              : undefined,
          enablePagination: false,
        });
      return Promise.resolve(connectorDefinitions);
    },
    enabled,
    retry: retry === false ? false : retry ? retry : 3,
  });
}
