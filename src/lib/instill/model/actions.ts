import axios from "axios";
import { ModelInstance } from "./types";

export type DeployModelResponse = {
  instance: ModelInstance;
};

export const deployModelInstanceAction = async (modelInstanceName: string) => {
  try {
    const { data } = await axios.post<DeployModelResponse>(
      `${process.env.NEXT_PUBLIC_MODEL_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/${modelInstanceName}:deploy`
    );
    return Promise.resolve(data.instance);
  } catch (err) {
    return Promise.reject(err);
  }
};

export type UnDeployModelResponse = {
  instance: ModelInstance;
};

export const unDeployModelInstanceAction = async (
  modelInstanceName: string
) => {
  try {
    const { data } = await axios.post<UnDeployModelResponse>(
      `${process.env.NEXT_PUBLIC_MODEL_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/${modelInstanceName}:undeploy`
    );
    return Promise.resolve(data.instance);
  } catch (err) {
    return Promise.reject(err);
  }
};

export type TestModelInstancePayload = {
  modelInstanceName: string;
  content: string;
};

type TestModelInstanceResult = {
  category: string;
  score: number;
};

export type TestModelInstanceResponse = {
  output: Record<string, TestModelInstanceResult[]>;
};

export const testModelInstance = async (payload: TestModelInstancePayload) => {
  try {
    const formData = new FormData();
    formData.append("file", payload.content);

    const { data } = await axios.post<TestModelInstanceResponse>(
      `${process.env.NEXT_PUBLIC_MODEL_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/${payload.modelInstanceName}:test-multipart`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return Promise.resolve(data.output);
  } catch (err) {
    return Promise.reject(err);
  }
};
