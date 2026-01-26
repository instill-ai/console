import { useQuery } from "@tanstack/react-query";
import { ComponentType, Nullable } from "instill-sdk";

import { getInstillAPIClient } from "../../sdk-helper";

export function useComponentDefinitions({
  componentType,
  accessToken,
  enabled,
}: {
  componentType: ComponentType | "all";
  accessToken: Nullable<string>;
  enabled: boolean;
}) {
  return useQuery({
    queryKey: ["component-definitions", componentType],
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillAPIClient({ accessToken });

      const connectorDefinitions =
        await client.pipeline.component.listComponentDefinitions({
          pageSize: 100,
          filter:
            componentType !== "all"
              ? `componentType=${componentType}`
              : undefined,
          enablePagination: false,
          view: "VIEW_FULL",
        });
      return Promise.resolve(connectorDefinitions);
    },
    enabled,
  });
}
