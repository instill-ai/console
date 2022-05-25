import {
  createSourceMutation,
  CreateSourcePayload,
  getSourceDefinitionQuery,
  getSourceQuery,
  listSourceDefinitionsQuery,
  listSourcesQuery,
  Source,
  SourceWithDefinition,
  SourceWithPipelines,
} from "@/lib/instill";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { usePipelines } from "../pipeline/PipelineServices";

export const useSourceDefinitions = () => {
  const queryClient = useQueryClient();

  return useQuery(["sources", "definition"], async () => {
    const sourceDefinitions = await listSourceDefinitionsQuery();
    return Promise.resolve(sourceDefinitions);
  });
};

export const useSource = (sourceId: string) => {
  return useQuery(["sources", sourceId], async () => {
    const source = await getSourceQuery(sourceId);
    const sourceDefinition = await getSourceDefinitionQuery(source.name);
    const sourceWithDefinition: SourceWithDefinition = {
      ...source,
      source_connector_definition: sourceDefinition,
    };
    return Promise.resolve(sourceWithDefinition);
  });
};

export const useSources = () => {
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

export const useSourcesWithPipelines = () => {
  const sources = useSources();
  const pipelines = usePipelines(true);
  return useQuery(
    ["sources-with-pipelines"],
    async () => {
      if (!sources.data || !pipelines.data) return [];

      console.log("hi");

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
    }
  );
};

export const useSourceWithPipelines = (sourceId: string) => {
  const pipelines = usePipelines(true);
  const source = useSource(sourceId);
  return useQuery(
    ["sources", sourceId, "with-pipelines"],
    async () => {
      if (!sourceId) {
        return Promise.reject(new Error("invalid source id"));
      }

      if (!pipelines.data) {
        return Promise.reject(new Error("invalid pipeline data"));
      }

      if (!source.data) {
        return Promise.reject(new Error("invalid source data"));
      }

      const targetPipelines = pipelines.data.filter(
        (e) => e.recipe.source.id === sourceId
      );

      const sourceWithPipelines: SourceWithPipelines = {
        ...source.data,
        pipelines: targetPipelines,
      };

      return Promise.resolve(sourceWithPipelines);
    },
    {
      enabled: sourceId
        ? true
        : source.isSuccess
        ? pipelines.isSuccess
          ? true
          : false
        : false,
    }
  );
};

export const useCreateSource = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (payload: CreateSourcePayload) => {
      const res = await createSourceMutation(payload);
      return Promise.resolve(res);
    },
    {
      onSuccess: (newSource) => {
        queryClient.setQueryData<Source>(["sources", newSource.id], newSource);
        const oldSources = queryClient.getQueryData<Source[]>(["sources"]);
        if (oldSources) {
          queryClient.setQueryData<Source[]>(
            ["sources"],
            [...oldSources, newSource]
          );
        } else {
          queryClient.invalidateQueries(["sources"]);
        }
      },
    }
  );
};
