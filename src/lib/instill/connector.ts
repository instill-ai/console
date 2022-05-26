import { Nullable } from "@/types/general";
import axios from "axios";
import { Pipeline } from "./pipeline";

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
      changelog_url?: string;
      connection_specification: Record<string, any>;
      supports_incremental: boolean;
      supports_normalization: boolean;
      supports_dbt: boolean;
      supported_destination_sync_modes: string[];
      advanced_auth: Nullable<Record<string, any>>;
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

// ###################################################################
// #                                                                 #
// # [Query] Source definition                                       #
// #                                                                 #
// ###################################################################

export type ListSourceDefinitionsResponse = {
  source_connector_definitions: ConnectorDefinition[];
  next_page_token: string;
  total_size: string;
};

export const listSourceDefinitionsQuery = async (): Promise<
  ConnectorDefinition[]
> => {
  try {
    const { data } = await axios.get<ListSourceDefinitionsResponse>(
      "/api/connector/list-source-definitions"
    );
    return Promise.resolve(data.source_connector_definitions);
  } catch (err) {
    return Promise.reject(err);
  }
};

export type GetSourceDefinitionResponse = {
  source_connector_definition: ConnectorDefinition;
};

export const getSourceDefinitionQuery = async (
  sourceDefinitionName: string
): Promise<ConnectorDefinition> => {
  try {
    const { data } = await axios.post<GetSourceDefinitionResponse>(
      "/api/connector/get-source-definition",
      { name: sourceDefinitionName }
    );
    return Promise.resolve(data.source_connector_definition);
  } catch (err) {
    return Promise.reject(err);
  }
};

// ###################################################################
// #                                                                 #
// # [Query] Source                                                  #
// #                                                                 #
// ###################################################################

export type Source = {
  name: string;
  uid: string;
  id: string;
  source_connector_definition: string;
  connector: Connector;
};

export type SourceWithDefinition = {
  name: string;
  uid: string;
  id: string;
  source_connector_definition: ConnectorDefinition;
  connector: Connector;
};

export type SourceWithPipelines = SourceWithDefinition & {
  pipelines: Pipeline[];
};

export type GetSourceResponse = {
  source_connector: Source;
};

export const getSourceQuery = async (sourceName: string): Promise<Source> => {
  try {
    const { data } = await axios.post<GetSourceResponse>(
      "/api/connector/get-source",
      { name: sourceName }
    );

    return Promise.resolve(data.source_connector);
  } catch (err) {
    return Promise.reject(err);
  }
};

export type ListSourcesResponse = {
  source_connectors: Source[];
  next_page_token: string;
  total_size: string;
};

export const listSourcesQuery = async (): Promise<Source[]> => {
  try {
    const { data } = await axios.get<ListSourcesResponse>(
      "/api/connector/list-sources"
    );

    return Promise.resolve(data.source_connectors);
  } catch (err) {
    return Promise.reject(err);
  }
};

// ###################################################################
// #                                                                 #
// # [Mutation] Source                                               #
// #                                                                 #
// ###################################################################

export type CreateSourceResponse = {
  source_connector: Source;
};

export type CreateSourcePayload = {
  id: string;
  source_connector_definition: string;
  connector: {
    description?: string;
    configuration: string;
  };
};

export const createSourceMutation = async (
  payload: CreateSourcePayload
): Promise<Source> => {
  try {
    const { data } = await axios.post<CreateSourceResponse>(
      "/api/connector/create-source",
      payload
    );
    return Promise.resolve(data.source_connector);
  } catch (err) {
    return Promise.reject(err);
  }
};

// ###################################################################
// #                                                                 #
// # [Query] Destination definition                                  #
// #                                                                 #
// ###################################################################

export type ListDestinationDefinitionsResponse = {
  destination_connector_definitions: ConnectorDefinition[];
  next_page_token: string;
  total_size: string;
};

export const listDestinationDefinitionsQuery = async (): Promise<
  ConnectorDefinition[]
> => {
  try {
    const { data } = await axios.get<ListDestinationDefinitionsResponse>(
      "/api/connector/list-destination-definitions"
    );
    return Promise.resolve(data.destination_connector_definitions);
  } catch (err) {
    return Promise.reject(err);
  }
};

export type GetDestinationDefinitionResponse = {
  destination_connector_definition: ConnectorDefinition;
};

export const getDestinationDefinitionQuery = async (
  destinationDefinitionName: string
) => {
  try {
    const { data } = await axios.post<GetDestinationDefinitionResponse>(
      "/api/connector/get-destination-definition",
      { id: destinationDefinitionName }
    );
    return Promise.resolve(data.destination_connector_definition);
  } catch (err) {
    return Promise.reject(err);
  }
};

// ###################################################################
// #                                                                 #
// # [Query] Destination                                             #
// #                                                                 #
// ###################################################################

export type Destination = {
  name: string;
  uid: string;
  id: string;
  destination_connector_definition: string;
  connector: Connector;
};

export type DestinationWithDefinition = {
  name: string;
  uid: string;
  id: string;
  destination_connector_definition: ConnectorDefinition;
  connector: Connector;
};

export type GetDestinationResponse = {
  destination_connector: Destination;
};

export const getDestinationQuery = async (
  destinationId: string
): Promise<Destination> => {
  try {
    const { data } = await axios.get<GetDestinationResponse>(
      `${process.env.NEXT_PUBLIC_CONNECTOR_API_ENDPOINT}/${process.env.NEXT_PUBLIC_API_VERSION}/${destinationId}`
    );

    return Promise.resolve(data.destination_connector);
  } catch (err) {
    return Promise.reject(err);
  }
};

export type ListDestinationsResponse = {
  destination_connectors: Destination[];
  next_page_token: string;
  total_size: string;
};

export const listDestinationsQuery = async (): Promise<Destination[]> => {
  try {
    const { data } = await axios.get<ListDestinationsResponse>(
      "/api/connector/list-destinations"
    );

    return Promise.resolve(data.destination_connectors);
  } catch (err) {
    return Promise.reject(err);
  }
};

// ###################################################################
// #                                                                 #
// # [Mutation] Destination                                          #
// #                                                                 #
// ###################################################################

export type CreateDestinationResponse = {
  destination_connector: Destination;
};

export type CreateDestinationPayload = {
  id: string;
  destination_connector_definition: string;
  connector: {
    description?: string;
    configuration: string;
  };
};

export const createDestinationMutation = async (
  payload: CreateDestinationPayload
): Promise<Destination> => {
  try {
    const { data } = await axios.post<CreateDestinationResponse>(
      "/api/connector/create-destination",
      payload
    );
    return Promise.resolve(data.destination_connector);
  } catch (err) {
    return Promise.reject(err);
  }
};
