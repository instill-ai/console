import { useQuery } from "@tanstack/react-query";

import { SourceWithPipelines } from "@/lib/instill";
import { usePipelines } from "@/services/pipeline";
import { useSources } from "./useSources";

export const useSourcesWithPipelines = () => {
  const sources = useSources();
  const pipelines = usePipelines(true);
  return useQuery(
    ["sources", "with-pipelines"],
    async () => {
      if (!sources.data || !pipelines.data) return [];

      const newSources: SourceWithPipelines[] = [];

      for (const source of sources.data) {
        const targetPipelines = pipelines.data.filter(
          (e) => e.recipe.source.id === source.id
        );
        newSources.push({
          ...source,
          pipelines: targetPipelines,
        });
      }

      return newSources;
    },
    {
      enabled: sources.isSuccess ? (pipelines.isSuccess ? true : false) : false,
      retry: 3,
    }
  );
};
