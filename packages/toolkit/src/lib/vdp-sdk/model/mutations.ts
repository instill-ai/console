/* eslint-disable @typescript-eslint/no-explicit-any */

import { Nullable } from "../../type";
import { createInstillAxiosClient } from "../helper";
import { Visibility } from "../types";
import { Model, ModelTask } from "./types";

export type CreateUserGithubModelConfiguration = {
  repository: string;
  tag: string;
};

export type CreateUserLocalModelConfiguration = {
  content: File;
};

export type CreateUserArtivcModelConfiguration = {
  url: string;
  tag: string;
  credential: Nullable<string>;
};

export type CreateUserHuggingFaceModelConfiguration = {
  repoId: string;
};

export type CreateUserModelPayload = {
  id: string;
  description?: string;
  visibility: Visibility;
  region: string;
  hardware: string;
  task: ModelTask;
  modelDefinition: "model-definitions/container";
  configuration: Record<string, string>;
};

export type UpdateUserModelPayload = {
  description?: string;
  sourceUrl?: string;
  documentationUrl?: string;
  license?: string;
  visibility?: Visibility;
  hardware?: string;
  configuration?: Record<string, string>;
  profileImage?: string;
  readme?: string;
  tags?: string[];
};

export type CreateUserGitHubModelPayload = {
  id: string;
  modelDefinition: string;
  description?: string;
  type: "GitHub";
  configuration: CreateUserGithubModelConfiguration;
};

export type CreateUserLocalModelPayload = {
  id: string;
  modelDefinition: string;
  description?: string;
  type: "Local";
  configuration: CreateUserLocalModelConfiguration;
};

export type CreateUserHuggingFaceModelPayload = {
  id: string;
  modelDefinition: string;
  description?: string;
  type: "HuggingFace";
  configuration: CreateUserHuggingFaceModelConfiguration;
};

export type CreateUserArtiVCModelPayload = {
  id: string;
  modelDefinition: string;
  description?: string;
  type: "ArtiVC";
  configuration: CreateUserArtivcModelConfiguration;
};

export type CreateUserModelResponse = {
  model: Model;
};

export async function createUserModelMutation({
  entityName,
  payload,
  accessToken,
}: {
  entityName: string;
  payload: CreateUserModelPayload;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, true);

    const { data } = await client.post<CreateUserModelResponse>(
      `/${entityName}/models`,
      payload,
    );

    return Promise.resolve(data.model);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type UpdateUserModelResponse = {
  model: Model;
};

export async function updateModelMutation({
  payload,
  accessToken,
  name,
}: {
  name: string;
  payload: UpdateUserModelPayload;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, true);

    const { data } = await client.patch<UpdateUserModelResponse>(
      `/${name}`,
      payload,
    );
    return Promise.resolve(data.model);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function deleteUserModelMutation({
  modelName,
  accessToken,
}: {
  modelName: string;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, true);

    await client.delete(`/${modelName}`);
  } catch (err) {
    return Promise.reject(err);
  }
}
