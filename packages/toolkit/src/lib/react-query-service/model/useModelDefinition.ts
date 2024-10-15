import { useQuery } from "@tanstack/react-query";

import type { Nullable } from "../../type";
import { getModelDefinitionQuery } from "../../vdp-sdk";

export function useModelDefinition({
  modelDefinitionName,
  accessToken,
  enabled,
}: {
  modelDefinitionName: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
}) {
  let enableQuery = false;

  if (modelDefinitionName && enabled) {
    enableQuery = true;
  }

  return useQuery({
    queryKey: ["model-definitions", modelDefinitionName],
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      if (!modelDefinitionName) {
        return Promise.reject(new Error("Model definition name not found"));
      }

      const definition = await getModelDefinitionQuery({
        modelDefinitionName,
        accessToken,
      });

      return Promise.resolve(definition);
    },
    enabled: enableQuery,
  });
}
