import axios from "axios";
import { ConnectorDefinition } from "../types";
import { Destination } from "./types";

// ###################################################################
// #                                                                 #
// # Destination definition                                          #
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
      `${process.env.NEXT_PUBLIC_CONNECTOR_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/destination-connector-definitions?view=VIEW_FULL`
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
    const { data } = await axios.get<GetDestinationDefinitionResponse>(
      `${process.env.NEXT_PUBLIC_CONNECTOR_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/${destinationDefinitionName}`
    );

    return Promise.resolve(data.destination_connector_definition);
  } catch (err) {
    return Promise.reject(err);
  }
};

// ###################################################################
// #                                                                 #
// # Destination                                                     #
// #                                                                 #
// ###################################################################

export type GetDestinationResponse = {
  destination_connector: Destination;
};

export const getDestinationQuery = async (
  destinationName: string
): Promise<Destination> => {
  try {
    const { data } = await axios.get<GetDestinationResponse>(
      `${process.env.NEXT_PUBLIC_CONNECTOR_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/${destinationName}?view=VIEW_FULL`
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
      `${process.env.NEXT_PUBLIC_CONNECTOR_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/destination-connectors?view=VIEW_FULL`
    );

    return Promise.resolve(data.destination_connectors);
  } catch (err) {
    return Promise.reject(err);
  }
};
