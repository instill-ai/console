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
import { Nullable } from "@/types/general";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { usePipelines } from "../pipeline/PipelineServices";

export const useSourceDefinitions = () => {
  return useQuery(["sources", "definition"], async () => {
    const sourceDefinitions = await listSourceDefinitionsQuery();
    return Promise.resolve(sourceDefinitions);
  });
};

export const useSource = (sourceName: Nullable<string>) => {
  return useQuery(
    ["sources", sourceName],
    async () => {
      if (!sourceName) {
        return Promise.reject(new Error("invalid source id"));
      }

      const source = await getSourceQuery(sourceName);
      const sourceDefinition = await getSourceDefinitionQuery(
        source.source_connector_definition
      );
      const sourceWithDefinition: SourceWithDefinition = {
        ...source,
        source_connector_definition: sourceDefinition,
      };
      return Promise.resolve(sourceWithDefinition);
    },
    {
      enabled: sourceName ? true : false,
    }
  );
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

export const useSourceWithPipelines = (sourceName: Nullable<string>) => {
  const pipelines = usePipelines(true);
  const source = useSource(sourceName);
  return useQuery(
    ["sources", sourceName, "with-pipelines"],
    async () => {
      if (!sourceName) {
        return Promise.reject(new Error("invalid source name"));
      }
      console.log(pipelines.data, source.data, sourceName);

      if (!source.data) {
        return Promise.reject(new Error("invalid source data"));
      }

      if (!pipelines.data) {
        return Promise.reject(new Error("invalid pipeline data"));
      }

      const targetPipelines = pipelines.data.filter(
        (e) => e.recipe.source.name === sourceName
      );

      const sourceWithPipelines: SourceWithPipelines = {
        ...source.data,
        pipelines: targetPipelines,
      };

      return Promise.resolve(sourceWithPipelines);
    },
    {
      enabled: sourceName
        ? source.isSuccess
          ? pipelines.isSuccess
            ? true
            : false
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
        queryClient.setQueryData<Source[] | undefined>(["sources"], (old) =>
          old?.map((e) => (e.id === newSource.id ? newSource : e))
        );
      },
    }
  );
};
