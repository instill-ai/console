import axios from "axios";
import { Destination } from "./types";

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
      `${process.env.NEXT_PUBLIC_CONNECTOR_API_ENDPOINT}/${process.env.NEXT_PUBLIC_API_VERSION}/destination-connectors`,
      payload
    );
    return Promise.resolve(data.destination_connector);
  } catch (err) {
    return Promise.reject(err);
  }
};
