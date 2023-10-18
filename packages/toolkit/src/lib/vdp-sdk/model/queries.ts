import { createInstillAxiosClient, getQueryString } from "../helper";
import type {
  Model,
  ModelReadme,
  ModelDefinition,
  ModelWatchState,
} from "./types";
import type { Nullable } from "../../type";

/* -------------------------------------------------------------------------
 * Model Definition
 * -----------------------------------------------------------------------*/

export type GetModelDefinitionResponse = {
  model_definition: ModelDefinition;
};

export async function getModelDefinitionQuery({
  modelDefinitionName,
  accessToken,
}: {
  modelDefinitionName: string;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "model");

    const { data } = await client.get<GetModelDefinitionResponse>(
      `/${modelDefinitionName}`
    );

    return Promise.resolve(data.model_definition);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type ListModelDefinitionsResponse = {
  model_definitions: ModelDefinition[];
  next_page_token: string;
  total_size: number;
};

export async function listModelDefinitionsQuery({
  pageSize,
  nextPageToken,
  accessToken,
}: {
  pageSize: Nullable<number>;
  nextPageToken: Nullable<string>;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "model");

    const modelDefinitions: ModelDefinition[] = [];

    const queryString = getQueryString({
      baseURL: "/model-definitions",
      pageSize,
      nextPageToken,
      filter: null,
    });

    const { data } =
      await client.get<ListModelDefinitionsResponse>(queryString);

    modelDefinitions.push(...data.model_definitions);

    if (data.next_page_token) {
      modelDefinitions.push(
        ...(await listModelDefinitionsQuery({
          pageSize,
          accessToken,
          nextPageToken: data.next_page_token,
        }))
      );
    }

    return Promise.resolve(modelDefinitions);
  } catch (err) {
    return Promise.reject(err);
  }
}

/* -------------------------------------------------------------------------
 * Model
 * -----------------------------------------------------------------------*/

export type GetUserModelResponse = {
  model: Model;
};

export async function getUserModelQuery({
  modelName,
  accessToken,
}: {
  modelName: string;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "model");

    const { data } = await client.get<GetUserModelResponse>(
      `/${modelName}?view=VIEW_FULL`
    );
    return Promise.resolve(data.model);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type ListModelsResponse = {
  models: Model[];
  next_page_token: string;
  total_size: number;
};

export async function listModelsQuery({
  pageSize,
  nextPageToken,
  accessToken,
}: {
  pageSize: Nullable<number>;
  nextPageToken: Nullable<string>;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "model");

    const models: Model[] = [];

    const queryString = getQueryString({
      baseURL: "/models?view=VIEW_FULL",
      pageSize,
      nextPageToken,
      filter: null,
    });

    const { data } = await client.get<ListModelsResponse>(queryString);

    models.push(...data.models);

    if (data.next_page_token) {
      models.push(
        ...(await listModelsQuery({
          pageSize,
          accessToken,
          nextPageToken: data.next_page_token,
        }))
      );
    }

    return Promise.resolve(models);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type ListUserModelsResponse = {
  models: Model[];
  next_page_token: string;
  total_size: number;
};

export async function listUserModelsQuery({
  userName,
  pageSize,
  nextPageToken,
  accessToken,
}: {
  userName: string;
  pageSize: Nullable<number>;
  nextPageToken: Nullable<string>;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "model");

    const models: Model[] = [];

    const queryString = getQueryString({
      baseURL: `/${userName}/models?view=VIEW_FULL`,
      pageSize,
      nextPageToken,
      filter: null,
    });

    const { data } = await client.get<ListUserModelsResponse>(queryString);

    models.push(...data.models);

    if (data.next_page_token) {
      models.push(
        ...(await listUserModelsQuery({
          userName,
          pageSize,
          accessToken,
          nextPageToken: data.next_page_token,
        }))
      );
    }

    return Promise.resolve(models);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type GetUserModelReadmeQueryResponse = {
  readme: ModelReadme;
};

export async function getUserModelReadmeQuery({
  modelName,
  accessToken,
}: {
  modelName: string;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "model");

    const { data } = await client.get<GetUserModelReadmeQueryResponse>(
      `/${modelName}/readme`
    );
    return Promise.resolve(data.readme);
  } catch (err) {
    return Promise.reject(err);
  }
}

/* -------------------------------------------------------------------------
 * Watch Model State
 * -----------------------------------------------------------------------*/

export async function watchUserModel({
  modelName,
  accessToken,
}: {
  modelName: string;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "model");
    const { data } = await client.get<ModelWatchState>(`/${modelName}/watch`);
    return Promise.resolve(data);
  } catch (err) {
    return Promise.reject(err);
  }
}
