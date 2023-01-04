import axios from "axios";
import { Operation } from "../types";
import { env } from "@/utils/config";

export type DeployModelResponse = {
  operation: Operation;
};

export const deployModelInstanceAction = async (modelInstanceName: string) => {
  try {
    const { data } = await axios.post<DeployModelResponse>(
      `${env("NEXT_PUBLIC_MODEL_BACKEND_BASE_URL")}/${env(
        "NEXT_PUBLIC_API_VERSION"
      )}/${modelInstanceName}/deploy`
    );
    return Promise.resolve(data.operation);
  } catch (err) {
    return Promise.reject(err);
  }
};

export type UnDeployModelResponse = {
  operation: Operation;
};

export const unDeployModelInstanceAction = async (
  modelInstanceName: string
) => {
  try {
    const { data } = await axios.post<UnDeployModelResponse>(
      `${env("NEXT_PUBLIC_MODEL_BACKEND_BASE_URL")}/${env(
        "NEXT_PUBLIC_API_VERSION"
      )}/${modelInstanceName}/undeploy`
    );
    return Promise.resolve(data.operation);
  } catch (err) {
    return Promise.reject(err);
  }
};

export type TestModelInstancePayload = {
  modelInstanceName: string;
  content: File;
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
      `${env("NEXT_PUBLIC_MODEL_BACKEND_BASE_URL")}/${env(
        "NEXT_PUBLIC_API_VERSION"
      )}/${payload.modelInstanceName}/test-multipart`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return Promise.resolve(data);
  } catch (err) {
    return Promise.reject(err);
  }
};
