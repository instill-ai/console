import {
  createSourceMutation,
  CreateSourcePayload,
  listSourceDefinitionsQuery,
  listSourcesQuery,
  Pipeline,
} from "@/lib/instill";
import { useMutation, useQuery, useQueryClient } from "react-query";
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
    const res = await listSourcesQuery();
    return Promise.resolve(res);
  });
};

export const useCreateSource = () => {
  return useMutation(async (payload: CreateSourcePayload) => {
    const res = await createSourceMutation(payload);
    return Promise.resolve(res);
  });
};
