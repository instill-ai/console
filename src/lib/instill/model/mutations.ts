import axios from "axios";
import { Model } from "./types";

export type CreateGithubModelPayload = {
  id: string;
  model_definition: string;
  configuration: string;
};

export type CreateGithubModelResponse = {
  model: Model;
};

export const createGithubModelMutation = async (
  payload: CreateGithubModelPayload
): Promise<Model> => {
  try {
    const { data } = await axios.post<CreateGithubModelResponse>(
      `${process.env.NEXT_PUBLIC_MODEL_API_ENDPOINT}/${process.env.NEXT_PUBLIC_API_VERSION}/models`,
      payload
    );
    return Promise.resolve(data.model);
  } catch (err) {
    return Promise.reject(err);
  }
};

export type CreateLocalModelPayload = {
  id: string;
  desctiption: string;
  model_definition: string;
  content: string;
};

export type CreateLocalModelResponse = {
  model: Model;
};

export const createLocalModelMutation = async (
  payload: CreateLocalModelPayload
) => {
  try {
    const formData = new FormData();
    formData.append("id", payload.id);
    formData.append("description", payload.desctiption);
    formData.append("model_definition", payload.model_definition);
    formData.append("content", payload.content);

    const { data } = await axios.post<CreateLocalModelResponse>(
      `${process.env.NEXT_PUBLIC_MODEL_API_ENDPOINT}/${process.env.NEXT_PUBLIC_API_VERSION}/models:multipart`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return Promise.resolve(data.model);
  } catch (err) {
    return Promise.reject(err);
  }
};

export type ArtivcConfiguration = {
  url: string;
  credential: Record<string, string>;
};

export type CreateArtivcModelPayload = {
  id: string;
  model_definition: string;
  configuration: ArtivcConfiguration;
};

export type CreateArtivcModelResponse = {
  model: Model;
};

export const createArtivcModelMutation = async (
  payload: CreateArtivcModelPayload
) => {
  try {
    const { data } = await axios.post<CreateLocalModelResponse>(
      `${process.env.NEXT_PUBLIC_MODEL_API_ENDPOINT}/${process.env.NEXT_PUBLIC_API_VERSION}/models:multipart`,
      {
        id: payload.id,
        model_definition: payload.model_definition,
        configuration: JSON.stringify(payload.configuration),
      }
    );
    return Promise.resolve(data.model);
  } catch (err) {
    return Promise.reject(err);
  }
};

export type UpdateModelPayload = Partial<Model> & {
  name: string;
};

export type UpdateModelResponse = {
  model: Model;
};

export const updateModelMutation = async (
  payload: UpdateModelPayload
): Promise<Model> => {
  try {
    const { data } = await axios.patch<UpdateModelResponse>(
      `${process.env.NEXT_PUBLIC_MODEL_API_ENDPOINT}/${process.env.NEXT_PUBLIC_API_VERSION}/${payload.name}`,
      payload
    );
    return Promise.resolve(data.model);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const deleteModelMutation = async (modelName: string) => {
  try {
    await axios.delete(
      `${process.env.NEXT_PUBLIC_MODEL_API_ENDPOINT}/${process.env.NEXT_PUBLIC_API_VERSION}/${modelName}`
    );
  } catch (err) {
    return Promise.reject(err);
  }
};
