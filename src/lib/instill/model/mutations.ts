import { Nullable } from "@/types/general";
import axios from "axios";
import { Model } from "./types";

export type CreateGithubModelConfiguration = {
  repository: string;
};

export type CreateGithubModelPayload = {
  id: string;
  model_definition: string;
  description: Nullable<string>;
  configuration: CreateGithubModelConfiguration;
};

export type CreateGithubModelResponse = {
  model: Model;
};

export const createGithubModelMutation = async (
  payload: CreateGithubModelPayload
): Promise<Model> => {
  try {
    const { data } = await axios.post<CreateGithubModelResponse>(
      `${process.env.NEXT_PUBLIC_MODEL_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/models`,
      {
        id: payload.id,
        model_definition: payload.model_definition,
        description: payload.description ?? undefined,
        configuration: {
          repository: payload.configuration.repository,
        },
      }
    );
    return Promise.resolve(data.model);
  } catch (err) {
    return Promise.reject(err);
  }
};

export type CreateLocalModelConfiguration = {
  content: string;
};

export type CreateLocalModelPayload = {
  id: string;
  desctiption: Nullable<string>;
  model_definition: string;
  configuration: CreateLocalModelConfiguration;
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
    formData.append("model_definition", payload.model_definition);
    formData.append("content", payload.configuration.content);

    if (payload.desctiption) {
      formData.append("description", payload.desctiption);
    }

    const { data } = await axios.post<CreateLocalModelResponse>(
      `${process.env.NEXT_PUBLIC_MODEL_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/models:multipart`,
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
  credential: Nullable<string>;
};

export type CreateArtivcModelPayload = {
  id: string;
  model_definition: string;
  description: Nullable<string>;
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
      `${process.env.NEXT_PUBLIC_MODEL_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/models`,
      {
        id: payload.id,
        model_definition: payload.model_definition,
        description: payload.description ?? undefined,
        configuration: {
          url: payload.configuration.url,
          credential: payload.configuration.credential
            ? payload.configuration.credential
            : undefined,
        },
      }
    );
    return Promise.resolve(data.model);
  } catch (err) {
    return Promise.reject(err);
  }
};

export type HuggingFaceConfiguration = {
  repo_id: string;
};

export type CreateHuggingFaceModelPayload = {
  id: string;
  model_definition: string;
  description: Nullable<string>;
  configuration: HuggingFaceConfiguration;
};

export type CreateHuggingFaceModelResponse = {
  model: Model;
};

export const createHuggingFaceModelMutation = async (
  payload: CreateHuggingFaceModelPayload
) => {
  try {
    const { data } = await axios.post<CreateLocalModelResponse>(
      `${process.env.NEXT_PUBLIC_MODEL_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/models`,
      {
        id: payload.id,
        model_definition: payload.model_definition,
        description: payload.description ?? undefined,
        configuration: {
          repo_id: payload.configuration.repo_id,
        },
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
      `${process.env.NEXT_PUBLIC_MODEL_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/${payload.name}`,
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
      `${process.env.NEXT_PUBLIC_MODEL_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/${modelName}`
    );
  } catch (err) {
    return Promise.reject(err);
  }
};
