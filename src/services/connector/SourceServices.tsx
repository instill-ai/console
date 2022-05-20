import ConnectorIcon from "@/components/ui/ConnectorIcon";
import { listSourceDefinitionQuery, Pipeline } from "@/lib/instill";
import { SingleSelectOption } from "@instill-ai/design-system";
import { useQuery, useQueryClient } from "react-query";
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

export const useSourceDefinitionOptions = () => {
  const queryClient = useQueryClient();

  return useQuery(
    ["source", "definition-options"],
    async () => {
      const sourceDefinitions = await listSourceDefinitionQuery();
      const options: SingleSelectOption[] = sourceDefinitions.map((e) => {
        return {
          label: e.connector_definition.title,
          value: e.id,
          startIcon: (
            <ConnectorIcon
              type={e.id}
              iconColor="fill-instillGrey90"
              iconHeight="h-[30px]"
              iconWidth="w-[30px]"
              iconPosition="my-auto"
            />
          ),
        };
      });
      return Promise.resolve(options);
    },
    {
      initialData: queryClient.getQueryData(["source", "definition-options"]),
    }
  );
};
