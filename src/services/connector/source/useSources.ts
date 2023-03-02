import { useQuery } from "@tanstack/react-query";
import {
  getSourceDefinitionQuery,
  listSourcesQuery,
  SourceWithDefinition,
} from "@/lib/instill";
import { defaultQueryParam } from "@/services/helper";

export const useSources = () => {
  return useQuery(
    ["sources"],
    async () => {
      const sources = await listSourcesQuery(
        defaultQueryParam.pageSize,
        defaultQueryParam.nextPageToken
      );
      const sourcesWithDefinition: SourceWithDefinition[] = [];

      for (const source of sources) {
        const sourceDefinition = await getSourceDefinitionQuery(
          source.source_connector_definition
        );
        sourcesWithDefinition.push({
          ...source,
          source_connector_definition: sourceDefinition,
        });
      }

      return Promise.resolve(sourcesWithDefinition);
    },
    {
      retry: 3,
    }
  );
};
