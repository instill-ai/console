import axios from "axios";
import { Source } from "./types";

export type CreateSourceResponse = {
  source_connector: Source;
};

export type CreateSourcePayload = {
  id: string;
  source_connector_definition: string;
  connector: {
    description?: string;
    configuration: Record<string, any> | Record<string, never>;
  };
};

export const createSourceMutation = async (
  payload: CreateSourcePayload
): Promise<Source> => {
  try {
    const { data } = await axios.post<CreateSourceResponse>(
      `${process.env.NEXT_PUBLIC_CONNECTOR_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/source-connectors`,
      payload
    );
    return Promise.resolve(data.source_connector);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const deleteSourceMutation = async (sourceName: string) => {
  try {
    await axios.delete(
      `${process.env.NEXT_PUBLIC_CONNECTOR_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/${sourceName}`
    );
  } catch (err) {
    return Promise.reject(err);
  }
};
