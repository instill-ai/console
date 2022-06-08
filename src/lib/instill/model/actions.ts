import axios from "axios";
import { ModelInstance } from "./types";

export type DeployModelResponse = {
  instance: ModelInstance;
};

export const deployModelInstanceAction = async (modelInstanceName: string) => {
  try {
    const { data } = await axios.post<DeployModelResponse>(
      `${process.env.NEXT_PUBLIC_MODEL_API_ENDPOINT}/${process.env.NEXT_PUBLIC_API_VERSION}/${modelInstanceName}:deploy`
    );
    return Promise.resolve(data.instance);
  } catch (err) {
    return Promise.reject(err);
  }
};
