import { useQuery } from "react-query";
import {
  getSourceDefinitionQuery,
  listSourcesQuery,
  SourceWithDefinition,
} from "@/lib/instill";

const useSources = () => {
  return useQuery(["sources"], async () => {
    const sources = await listSourcesQuery();
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
  });
};

export default useSources;
