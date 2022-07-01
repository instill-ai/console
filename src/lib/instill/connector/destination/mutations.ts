import axios from "axios";
import { Destination } from "./types";

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
      `${process.env.NEXT_PUBLIC_CONNECTOR_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/destination-connectors`,
      payload
    );
    return Promise.resolve(data.destination_connector);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const deleteDestinationMutation = async (destinationName: string) => {
  try {
    await axios.delete(
      `${process.env.NEXT_PUBLIC_CONNECTOR_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/${destinationName}`
    );
  } catch (err) {
    return Promise.reject(err);
  }
};
