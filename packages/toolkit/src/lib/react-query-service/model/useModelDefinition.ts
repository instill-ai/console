import { useQuery } from "@tanstack/react-query";
import { getModelDefinitionQuery } from "../../vdp-sdk";
import type { Nullable } from "../../type";

export const useModelDefinition = ({
  modelDefinitionName,
  accessToken,
  enabled,
  retry,
}: {
  modelDefinitionName: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  /**
   * - Default is 3
   * - Set to false to disable retry
   */
  retry?: false | number;
}) => {
  let enableQuery = false;

  if (modelDefinitionName && enabled) {
    enableQuery = true;
  }

  return useQuery(
    ["model-definitions", modelDefinitionName],
    async () => {
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
    { enabled: enableQuery, retry: retry === false ? false : retry ? retry : 3 }
  );
};
