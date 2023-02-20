import { useQuery } from "@tanstack/react-query";
import { getModelDefinitionQuery } from "@/lib/instill";
import { Nullable } from "@/types/general";

export const useModelDefinition = (modelDefinitionName: Nullable<string>) => {
  return useQuery(
    ["models", "definition", modelDefinitionName],
    async () => {
      if (!modelDefinitionName) {
        return Promise.reject(new Error("Model definition name not found"));
      }

      const definition = await getModelDefinitionQuery(modelDefinitionName);
      return Promise.resolve(definition);
    },
    { enabled: modelDefinitionName ? true : false, retry: 3 }
  );
};
