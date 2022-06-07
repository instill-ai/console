import axios from "axios";
import { Source } from "./types";

// ###################################################################
// #                                                                 #
// # Source                                                          #
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
      `${process.env.NEXT_PUBLIC_CONNECTOR_API_ENDPOINT}/${process.env.NEXT_PUBLIC_API_VERSION}/source-connectors`,
      payload
    );
    return Promise.resolve(data.source_connector);
  } catch (err) {
    return Promise.reject(err);
  }
};
