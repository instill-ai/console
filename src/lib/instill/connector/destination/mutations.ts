import { AirbyteFieldValues } from "@/lib/airbytes";
import { env } from "@/utils/config";
import axios from "axios";
import { createInstillAxiosClient } from "../../helper";
import { Destination } from "./types";

export type CreateDestinationResponse = {
  destination_connector: Destination;
};

export type CreateDestinationPayload = {
  id: string;
  destination_connector_definition: string;
  connector: {
    description?: string;
    configuration: /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    Record<string, any> | AirbyteFieldValues | Record<string, never>;
  };
};

export const createDestinationMutation = async (
  payload: CreateDestinationPayload
): Promise<Destination> => {
  try {
    const client = createInstillAxiosClient();

    const { data } = await client.post<CreateDestinationResponse>(
      `${env("NEXT_PUBLIC_API_VERSION")}/destination-connectors`,
      payload
    );
    return Promise.resolve(data.destination_connector);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const deleteDestinationMutation = async (destinationName: string) => {
  try {
    const client = createInstillAxiosClient();

    await client.delete(`${env("NEXT_PUBLIC_API_VERSION")}/${destinationName}`);
  } catch (err) {
    return Promise.reject(err);
  }
};

export type UpdateDestinationResponse = {
  destination_connector: Destination;
};

export type UpdateDestinationPayload = {
  name: string;
  connector: {
    description?: string;
    configuration: /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    Record<string, any> | AirbyteFieldValues | Record<string, never>;
  };
};

export const updateDestinationMutation = async (
  payload: UpdateDestinationPayload
) => {
  try {
    const client = createInstillAxiosClient();
    const { name, ...data } = payload;

    const res = await client.patch<UpdateDestinationResponse>(
      `${env("NEXT_PUBLIC_API_VERSION")}/${name}`,
      data
    );
    return Promise.resolve(res.data.destination_connector);
  } catch (err) {
    return Promise.reject(err);
  }
};
