import type { Nullable } from "../../type";
import type {
  Model,
  ModelDefinition,
  ModelReadme,
  ModelRegion,
  ModelRun,
  ModelTriggerResult,
  ModelVersion,
} from "./types";
import { getInstillModelAPIClient } from "..";
import { createInstillAxiosClient, getQueryString } from "../helper";
import { Visibility } from "../types";

/* -------------------------------------------------------------------------
 * Model Definition
 * -----------------------------------------------------------------------*/

export type GetModelDefinitionResponse = {
  modelDefinition: ModelDefinition;
};

export async function getModelDefinitionQuery({
  modelDefinitionName,
  accessToken,
}: {
  modelDefinitionName: string;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, true);

    const { data } = await client.get<GetModelDefinitionResponse>(
      `/${modelDefinitionName}`,
    );

    return Promise.resolve(data.modelDefinition);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type ListModelDefinitionsResponse = {
  modelDefinitions: ModelDefinition[];
  nextPageToken: string;
  totalSize: number;
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
    const client = createInstillAxiosClient(accessToken, true);

    const modelDefinitions: ModelDefinition[] = [];

    const queryString = getQueryString({
      baseURL: "/model-definitions?view=VIEW_FULL",
      pageSize,
      nextPageToken,
      filter: null,
    });

    const { data } =
      await client.get<ListModelDefinitionsResponse>(queryString);

    modelDefinitions.push(...data.modelDefinitions);

    if (data.nextPageToken) {
      modelDefinitions.push(
        ...(await listModelDefinitionsQuery({
          pageSize,
          accessToken,
          nextPageToken: data.nextPageToken,
        })),
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

export async function getUserModelQuery({
  modelName,
  accessToken,
}: {
  modelName: string;
  accessToken: Nullable<string>;
}) {
  try {
    const client = getInstillModelAPIClient({
      accessToken: accessToken ?? undefined,
    });

    const model = await client.model.getNamespaceModel({
      namespaceModelName: modelName,
      view: "VIEW_FULL",
    });
    return Promise.resolve(model);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type ListModelsResponse = {
  models: Model[];
  nextPageToken: string;
  totalSize: number;
};

export type listModelsQueryProps = {
  pageSize: Nullable<number>;
  nextPageToken: Nullable<string>;
  accessToken: Nullable<string>;
  filter: Nullable<string>;
  visibility: Nullable<Visibility>;
  orderBy?: Nullable<string>;
  disabledViewFull?: boolean;
};
export type listUserModelsQueryProps = {
  userName: Nullable<string>;
} & listModelsQueryProps;

export type listUserModelRegionsQueryProps = {
  accessToken: Nullable<string>;
};

export type listModelRunsQueryProps = {
  modelName: string;
  accessToken: Nullable<string>;
  fullView: boolean;
  pageSize: number;
  page: number;
  orderBy: Nullable<string>;
  filter: Nullable<string>;
};

export type listUserModelVersionsQueryProps = {
  accessToken: Nullable<string>;
  modelName: string;
  page?: number | null;
  pageSize?: number;
};

export type ListModelRegionsResponse = {
  regions: ModelRegion[];
};

export type ListModelRunsResponse = {
  runs: ModelRun[];
  totalSize: number;
  pageSize: number;
  page: number;
};

export type ListModelVersionsResponse = {
  versions: ModelVersion[];
  totalSize: number;
  pageSize: number;
  page: number;
};

export async function listModelsQuery(
  props: listModelsQueryProps & {
    enablePagination: true;
  },
): Promise<ListModelsResponse>;
export async function listModelsQuery(
  props: listModelsQueryProps & {
    enablePagination: false;
  },
): Promise<Model[]>;
export async function listModelsQuery(
  props: listModelsQueryProps & {
    enablePagination: undefined;
  },
): Promise<Model[]>;
export async function listModelsQuery({
  pageSize,
  nextPageToken,
  accessToken,
  filter,
  visibility,
  enablePagination,
  orderBy,
  disabledViewFull,
}: listModelsQueryProps & {
  enablePagination?: boolean;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, true);

    const models: Model[] = [];

    const queryString = getQueryString({
      baseURL: disabledViewFull ? "/models" : "/models?view=VIEW_FULL",
      pageSize,
      nextPageToken,
      queryParams: visibility ? `visibility=${visibility}` : undefined,
      filter,
      orderBy,
    });

    const { data } = await client.get<ListModelsResponse>(queryString);

    if (enablePagination) {
      return Promise.resolve(data);
    }

    models.push(...data.models);

    if (data.nextPageToken) {
      models.push(
        ...(await listModelsQuery({
          pageSize,
          nextPageToken: data.nextPageToken,
          accessToken,
          enablePagination: false,
          filter,
          visibility,
          orderBy,
        })),
      );
    }

    return Promise.resolve(models);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function listUserModelsQuery(
  props: listUserModelsQueryProps & {
    enablePagination: true;
  },
): Promise<ListModelsResponse>;
export async function listUserModelsQuery(
  props: listUserModelsQueryProps & {
    enablePagination: false;
  },
): Promise<Model[]>;
export async function listUserModelsQuery(
  props: listUserModelsQueryProps & {
    enablePagination: undefined;
  },
): Promise<Model[]>;
export async function listUserModelsQuery({
  userName,
  pageSize,
  nextPageToken,
  accessToken,
  filter,
  visibility,
  enablePagination,
  disabledViewFull,
}: listUserModelsQueryProps & {
  enablePagination?: boolean;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, true);
    const models: Model[] = [];

    const queryString = getQueryString({
      baseURL: disabledViewFull
        ? `/${userName}/models`
        : `/${userName}/models?view=VIEW_FULL`,
      pageSize,
      nextPageToken,
      filter,
      queryParams: visibility ? `visibility=${visibility}` : undefined,
    });

    const { data } = await client.get<ListModelsResponse>(queryString);

    if (enablePagination) {
      return Promise.resolve(data);
    }

    models.push(...data.models);

    if (data.nextPageToken) {
      models.push(
        ...(await listUserModelsQuery({
          userName,
          pageSize,
          nextPageToken: data.nextPageToken,
          accessToken,
          enablePagination: false,
          filter,
          visibility,
        })),
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
    const client = createInstillAxiosClient(accessToken, true);

    const { data } = await client.get<GetUserModelReadmeQueryResponse>(
      `/${modelName}/readme`,
    );
    return Promise.resolve(data.readme);
  } catch (err) {
    return Promise.reject(err);
  }
}

/* -------------------------------------------------------------------------
 * List Model Regions
 * -----------------------------------------------------------------------*/

export async function listModelRegionsQuery({
  accessToken,
}: listUserModelRegionsQueryProps) {
  try {
    const client = createInstillAxiosClient(accessToken, true);

    const queryString = getQueryString({
      baseURL: "/available-regions",
      pageSize: null,
      nextPageToken: null,
    });

    const { data } = await client.get<ListModelRegionsResponse>(queryString);

    return Promise.resolve(data.regions);
  } catch (err) {
    return Promise.reject(err);
  }
}

/* -------------------------------------------------------------------------
 * List Model Runs
 * -----------------------------------------------------------------------*/

export async function listModelRunsQuery({
  modelName,
  accessToken,
  fullView,
  pageSize,
  page,
  orderBy,
  filter,
}: listModelRunsQueryProps) {
  try {
    const client = createInstillAxiosClient(accessToken, true);

    const queryString = getQueryString({
      baseURL: `${modelName}/runs${fullView ? "?view=VIEW_FULL" : ""}`,
      pageSize,
      page,
      filter,
      orderBy,
    });

    const { data } = await client.get<ListModelRunsResponse>(queryString);

    return Promise.resolve(data);
  } catch (err) {
    return Promise.reject(err);
  }
}

/* -------------------------------------------------------------------------
 * List Model Versions
 * -----------------------------------------------------------------------*/

export async function listModelVersionsQuery(
  props: listUserModelVersionsQueryProps & {
    enablePagination: true;
  },
): Promise<ListModelVersionsResponse>;
export async function listModelVersionsQuery(
  props: listUserModelVersionsQueryProps & {
    enablePagination: false;
  },
): Promise<ModelVersion[]>;
export async function listModelVersionsQuery(
  props: listUserModelVersionsQueryProps & {
    enablePagination: undefined;
  },
): Promise<ModelVersion[]>;
export async function listModelVersionsQuery({
  accessToken,
  modelName,
  page,
  pageSize,
  enablePagination,
}: listUserModelVersionsQueryProps & { enablePagination?: boolean }) {
  try {
    const client = createInstillAxiosClient(accessToken, true);
    const versions: ModelVersion[] = [];
    const queryString = getQueryString({
      baseURL: `${modelName}/versions`,
      pageSize: pageSize || null,
      nextPageToken: null,
      queryParams: page ? `page=${page}` : undefined,
    });

    const { data } = await client.get<ListModelVersionsResponse>(queryString);

    if (enablePagination) {
      return Promise.resolve(data);
    }

    versions.push(...data.versions);

    const lastPage = Math.ceil(data.totalSize / data.pageSize) - 1;

    if (data.page < lastPage) {
      versions.push(
        ...(await listModelVersionsQuery({
          accessToken,
          modelName,
          page: data.page + 1,
          pageSize,
          enablePagination: false,
        })),
      );
    }

    return Promise.resolve(versions);
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
    const client = getInstillModelAPIClient({
      accessToken: accessToken ?? undefined,
    });

    const state = await client.model.watchNamespaceModelLatestVersionState({
      namespaceModelName: modelName,
    });
    return Promise.resolve(state);
  } catch (err) {
    return Promise.reject(err);
  }
}

/* -------------------------------------------------------------------------
 * Get Model Trigger Result
 * -----------------------------------------------------------------------*/

export async function getModelOperationResult({
  modelName,
  accessToken,
  fullView,
}: {
  modelName: string;
  accessToken: Nullable<string>;
  fullView: boolean;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, true);
    const { data } = await client.get<ModelTriggerResult>(
      `/${modelName}/operation${fullView ? "?view=VIEW_FULL" : ""}`,
    );
    return Promise.resolve(data);
  } catch (err) {
    return Promise.reject(err);
  }
}
