import ConnectorIcon from "@/components/ui/ConnectorIcon";
import {
  createSourceMutation,
  CreateSourcePayload,
  listSourceDefinitionsQuery,
  Pipeline,
} from "@/lib/instill";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { mockPipelines } from "../pipeline/PipelineServices";
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

export const mockSources: Source[] = [
  {
    type: "salesforce",
    name: "test-salesforce",
    state: "connected",
    create_time: "2022-05-10T11:54:35.845Z",
    update_time: "2022-05-10T11:54:35.846Z",
    pipelines: mockPipelines,
  },
  {
    type: "mysql",
    name: "test-mySQL",
    state: "connected",
    create_time: "2022-05-10T11:54:35.845Z",
    update_time: "2022-05-10T11:54:35.846Z",
    pipelines: [mockPipelines[0]],
  },
  {
    type: "redshift",
    name: "test-redshift",
    state: "disconnected",
    create_time: "2022-05-10T11:54:35.845Z",
    update_time: "2022-05-10T11:54:35.846Z",
    pipelines: [mockPipelines[1], mockPipelines[2]],
  },
];

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

export const useCreateSource = () => {
  return useMutation(async (payload: CreateSourcePayload) => {
    const res = await createSourceMutation(payload);
    return Promise.resolve(res);
  });
};
