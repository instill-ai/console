import { Model } from "@/services/model/ModelServices";
import { Mode, Status } from "@/types/general";
import axios from "axios";

export type PipelineMode = "MODE_UNSPECIFIED" | "MODE_SYNC" | "MODE_ASYNC";

export type PipelineState =
  | "STATE_UNSPECIFIED"
  | "STATE_ACTIVE"
  | "STATE_INACTIVE"
  | "STATE_ERROR";

export type Pipeline = {
  id: string;
  description: string;
  mode: Mode;
  status: Status;
  owner_id: string;
  full_name: string;
  create_time: string;
  update_time: string;
  recipe: PipelineRecipe;
};

export type RawPipeline = {
  name: string;
  uid: string;
  id: string;
  description: string;
  recipe: PipelineRawRecipe;
  mode: PipelineMode;
  state: PipelineState;
  user: string;
  org: string;
  create_time: string;
  update_time: string;
};

export type PipelineRawRecipe = {
  source: string;
  destination: string;
  model_instances: string;
};

export type PipelineRecipe = {
  source: {
    name: string;
    type: string;
  };
  destination: {
    name: string;
    type: string;
  };
  models: Model[];
};

export type ListPipelinesResponse = {
  pipelines: RawPipeline[];
  next_page_token: string;
  total_size: string;
};

export const listPipelinesQuery = async () => {
  try {
    const res = await axios.get<ListPipelinesResponse>(
      `${process.env.NEXT_PUBLIC_PIPELINE_API_ENDPOINT}/${process.env.NEXT_PUBLIC_API_VERSION}/pipelines?view=VIEW_FULL`
    );

    return Promise.resolve(res.data.pipelines);
  } catch (err) {
    return Promise.reject(err);
  }
};

export type GetSourceResponse = {
  name: string;
  uid: string;
  id: string;
  source_connector_definition: string;
  connector: RawConnector;
};

export type ConnectorType = "source" | "destination";

export type RawConnector = {
  description: string;
  configuration: string;
  tombstone: boolean;
  user: string;
  org: string;
  create_time: string;
  update_time: string;
};

export type Source = {
  id: string;
  type: ConnectorType;
  description: string;
  create_time: string;
  update_time: string;
  definition: string;
  user: string;
  org: string;
};

export type GetSourceDefinitionResponse = {
  name: string;
  uid: string;
  id: string;
  connector_definition: {
    title: string;
    docker_repository: string;
    docker_image_tag: string;
    documentation_url: string;
    icon: string;
    connection_type: string;
    spec: {
      documentation_url: string;
      changelog_url: string;
      connection_specification: Record<string, any>;
      supports_incremental: string;
      supports_normalization: string;
      supports_dbt: boolean;
      supported_destination_sync_modes: string[];
      advanced_auth: {
        auth_flow_type: string;
        predicate_key: string[];
        predicate_value: string;
        oauth_config_specification: {
          oauth_user_input_from_connector_config_specification: Record<
            string,
            any
          >;
          complete_oauth_output_specification: Record<string, any>;
          complete_oauth_server_input_specification: Record<string, any>;
          complete_oauth_server_output_specification: Record<string, any>;
        };
      };
    };
    tombstone: boolean;
    public: boolean;
    custom: boolean;
    release_stage: string;
    release_date: {
      year: number;
      month: number;
      day: number;
    };
    resource_requirements: Record<string, any>;
    create_time: string;
    update_time: string;
  };
};

export const getSourceQuery = async (sourceId: string): Promise<Source> => {
  try {
    const res = await axios.get<GetSourceResponse>(
      `${process.env.NEXT_PUBLIC_CONNECTOR_API_ENDPOINT}/${process.env.NEXT_PUBLIC_API_VERSION}/${sourceId}`
    );

    const source: Source = {
      id: res.data.id,
      type: "source",
      description: res.data.connector.description,
      create_time: res.data.connector.create_time,
      update_time: res.data.connector.update_time,
      org: res.data.connector.org,
      user: res.data.connector.user,
      definition: res.data.source_connector_definition,
    };

    return Promise.resolve(source);
  } catch (err) {
    return Promise.reject(err);
  }
};

export type GetDestinationResponse = {
  name: string;
  uid: string;
  id: string;
  destination_connector_definition: string;
  connector: RawConnector;
};

export type Destination = {
  id: string;
  type: ConnectorType;
  description: string;
  create_time: string;
  update_time: string;
  definition: string;
  user: string;
  org: string;
};

export const getDestinationQuery = async (
  destinationId: string
): Promise<Destination> => {
  try {
    const res = await axios.get<GetDestinationResponse>(
      `${process.env.NEXT_PUBLIC_CONNECTOR_API_ENDPOINT}/${process.env.NEXT_PUBLIC_API_VERSION}/${destinationId}`
    );

    const destination: Destination = {
      id: res.data.id,
      type: "destination",
      description: res.data.connector.description,
      create_time: res.data.connector.create_time,
      update_time: res.data.connector.update_time,
      org: res.data.connector.org,
      user: res.data.connector.user,
      definition: res.data.destination_connector_definition,
    };

    return Promise.resolve(destination);
  } catch (err) {
    return Promise.reject(err);
  }
};
