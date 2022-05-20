import axios from "axios";

export type ConnectorState =
  | "STATE_CONNECTED"
  | "STATE_DISCONNECTED"
  | "STATE_ERROR";

export type Connector = {
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
  description: string;
  create_time: string;
  update_time: string;
  definition: string;
  user: string;
  org: string;
};

export type GetSourceResponse = {
  name: string;
  uid: string;
  id: string;
  source_connector_definition: string;
  connector: Connector;
};

export const getSourceQuery = async (sourceId: string): Promise<Source> => {
  try {
    const res = await axios.get<GetSourceResponse>(
      `${process.env.NEXT_PUBLIC_CONNECTOR_API_ENDPOINT}/${process.env.NEXT_PUBLIC_API_VERSION}/${sourceId}`
    );

    const source: Source = {
      id: res.data.id,
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

export type ConnectorDefinition = {
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
      advanced_auth: Record<string, any>;
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

export type ListSourceDefinitionResponse = {
  source_connector_definitions: ConnectorDefinition[];
  next_page_token: string;
  total_size: string;
};

export const listSourceDefinitionQuery = async (): Promise<
  ConnectorDefinition[]
> => {
  try {
    const { data } = await axios.get<ListSourceDefinitionResponse>(
      "/api/connector/list-source-definition"
    );
    return Promise.resolve(data.source_connector_definitions);
  } catch (err) {
    return Promise.reject(err);
  }
};

export type GetDestinationResponse = {
  name: string;
  uid: string;
  id: string;
  destination_connector_definition: string;
  connector: Connector;
};

export type Destination = {
  id: string;
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
