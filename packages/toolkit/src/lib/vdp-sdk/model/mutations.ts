/* eslint-disable @typescript-eslint/no-explicit-any */

import { Nullable } from "../../type";
import { createInstillAxiosClient } from "../helper";
import { Operation } from "../operation";
import { Model } from "./types";

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
  repo_id: string;
};

export type CreateUserModelPayload =
  | CreateUserGitHubModelPayload
  | CreateUserLocalModelPayload
  | CreateUserHuggingFaceModelPayload
  | CreateUserArtiVCModelPayload;

export type CreateUserGitHubModelPayload = {
  id: string;
  model_definition: string;
  description?: string;
  type: "GitHub";
  configuration: CreateUserGithubModelConfiguration;
};

export type CreateUserLocalModelPayload = {
  id: string;
  model_definition: string;
  description?: string;
  type: "Local";
  configuration: CreateUserLocalModelConfiguration;
};

export type CreateUserHuggingFaceModelPayload = {
  id: string;
  model_definition: string;
  description?: string;
  type: "HuggingFace";
  configuration: CreateUserHuggingFaceModelConfiguration;
};

export type CreateUserArtiVCModelPayload = {
  id: string;
  model_definition: string;
  description?: string;
  type: "ArtiVC";
  configuration: CreateUserArtivcModelConfiguration;
};

export type CreateUserModelResponse = {
  operation: Operation;
};

export async function createUserModelMutation({
  userName,
  payload,
  accessToken,
}: {
  userName: string;
  payload: CreateUserModelPayload;
  accessToken: Nullable<string>;
}) {
  const client = createInstillAxiosClient(accessToken, true);
  if (payload.type === "Local") {
    try {
      const formData = new FormData();
      formData.append("id", payload.id);
      formData.append("model_definition", payload.model_definition);
      formData.append("content", payload.configuration.content);

      if (payload.description) {
        formData.append("description", payload.description);
      }

      const { data } = await client.post<CreateUserModelResponse>(
        `${userName}/models/multipart`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return Promise.resolve(data.operation);
    } catch (err) {
      return Promise.reject(err);
    }
  } else {
    let input: Record<string, any> = {};

    if (payload.type === "GitHub") {
      input = {
        id: payload.id,
        model_definition: payload.model_definition,
        description: payload.description,
        configuration: {
          repository: payload.configuration.repository,
          tag: payload.configuration.tag,
        },
      };
    } else if (payload.type === "ArtiVC") {
      input = {
        id: payload.id,
        model_definition: payload.model_definition,
        description: payload.description,
        configuration: {
          url: payload.configuration.url,
          credential: payload.configuration.credential
            ? JSON.parse(payload.configuration.credential)
            : undefined,
          tag: payload.configuration.tag,
        },
      };
    } else {
      input = {
        id: payload.id,
        model_definition: payload.model_definition,
        description: payload.description,
        configuration: {
          repo_id: payload.configuration.repo_id,
        },
      };
    }

    try {
      const { data } = await client.post<CreateUserModelResponse>(
        `${userName}/models`,
        input
      );

      return Promise.resolve(data.operation);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}

export type UpdateUserModelPayload = {
  name: string;
  description?: string;
  configuration?: Record<string, any>;
};

export type UpdateUserModelResponse = {
  model: Model;
};

export async function updateModelMutation({
  payload,
  accessToken,
}: {
  payload: UpdateUserModelPayload;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, true);

    const { data } = await client.patch<UpdateUserModelResponse>(
      `/${payload.name}`,
      payload
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
