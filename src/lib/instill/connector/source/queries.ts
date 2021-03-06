import axios from "axios";
import { ConnectorDefinition } from "../types";
import { Source } from "./types";

// ###################################################################
// #                                                                 #
// # Source definition                                               #
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
      `${process.env.NEXT_PUBLIC_CONNECTOR_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/source-connector-definitions?view=VIEW_FULL`
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
    const { data } = await axios.get<GetSourceDefinitionResponse>(
      `${process.env.NEXT_PUBLIC_CONNECTOR_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/${sourceDefinitionName}`
    );

    return Promise.resolve(data.source_connector_definition);
  } catch (err) {
    return Promise.reject(err);
  }
};

// ###################################################################
// #                                                                 #
// # Source                                                          #
// #                                                                 #
// ###################################################################

export type GetSourceResponse = {
  source_connector: Source;
};

export const getSourceQuery = async (sourceName: string): Promise<Source> => {
  try {
    const { data } = await axios.get<GetSourceResponse>(
      `${process.env.NEXT_PUBLIC_CONNECTOR_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/${sourceName}?view=VIEW_FULL`
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
      `${process.env.NEXT_PUBLIC_CONNECTOR_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/source-connectors?view=VIEW_FULL`
    );

    return Promise.resolve(data.source_connectors);
  } catch (err) {
    return Promise.reject(err);
  }
};
