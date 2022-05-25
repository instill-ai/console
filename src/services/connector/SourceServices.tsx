import {
  createSourceMutation,
  CreateSourcePayload,
  getSourceDefinitionQuery,
  getSourceQuery,
  listSourceDefinitionsQuery,
  listSourcesQuery,
  Pipeline,
  SourceWithDefinition,
  SourceWithPipelines,
} from "@/lib/instill";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { usePipelines } from "../pipeline/PipelineServices";
import { Connector } from "./ConnectorType";

export type SourceConnector = {
  // "source-connectors/{id},
  name: string;

  // uuid
  uid: string;

  // source name
  id: string;

  // source-definitions/s3
  source_connector_definition: string;
  connector: Connector;
};

export type ListSourceConnectorsResponse = {
  source_connectors: SourceConnector[];
  next_page_token: string;
  total_size: string;
};

export type Source = {
  type: string;
  name: string;
  state: "connected" | "disconnected" | "error";
  update_time: string;
  create_time: string;
  pipelines: Pipeline[];
};

export const useSourceDefinitions = () => {
  const queryClient = useQueryClient();

  return useQuery(
    ["source", "definitions"],
    async () => {
      const sourceDefinitions = await listSourceDefinitionsQuery();
      return Promise.resolve(sourceDefinitions);
    },
    {
      initialData: queryClient.getQueryData(["source", "definition-options"]),
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

export const useCreateSource = () => {
  return useMutation(async (payload: CreateSourcePayload) => {
    const res = await createSourceMutation(payload);
    return Promise.resolve(res);
  });
};
