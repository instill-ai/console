import { getInstillAdditionalHeaders, getQueryString } from "../helper";
import { APIResource } from "../main/resource";
import {
  CreateNamespaceModelRequest,
  CreateNamespaceModelResponse,
  DeleteNamespaceModelRequest,
  DeleteNamespaceModelVersionRequest,
  GetModelDefinitionRequest,
  GetModelDefinitionResponse,
  GetNamespaceModelReadmeRequest,
  GetNamespaceModelReadmeResponse,
  GetNamespaceModelRequest,
  GetNamespaceModelResponse,
  ListAccessibleModelsRequest,
  ListAccessibleModelsResponse,
  ListAvailableRegionResponse,
  ListModelDefinitionsRequest,
  ListModelDefinitionsResponse,
  ListModelRunsRequest,
  ListModelRunsResponse,
  ListNamespaceModelsRequest,
  ListNamespaceModelsResponse,
  ListNamespaceModelVersionsRequest,
  ListNamespaceModelVersionsResponse,
  Model,
  ModelDefinition,
  ModelVersion,
  PublishNamespaceModelRequest,
  PublishNamespaceModelResponse,
  RenameNamespaceModelRequest,
  RenameNamespaceModelResponse,
  TriggerAsyncNamespaceModelLatestVersionRequest,
  TriggerAsyncNamespaceModelVersionRequest,
  TriggerNamespaceModelLatestVersionRequest,
  TriggerNamespaceModelLatestVersionResponse,
  TriggerNamespaceModelVersionRequest,
  TriggerNamespaceModelVersionResponse,
  UnPublishNamespaceModelRequest,
  UnPublishNamespaceModelResponse,
  UpdateNamespaceModelRequest,
  UpdateNamespaceModelResponse,
  WatchNamespaceModelLatestVersionStateRequest,
  WatchNamespaceModelLatestVersionStateResponse,
  WatchNamespaceModelVersionStateRequest,
  WatchNamespaceModelVersionStateResponse,
} from "./types";

export class ModelClient extends APIResource {
  /* ----------------------------------------------------------------------------
   * Query
   * ---------------------------------------------------------------------------*/

  async listModelDefinitions(
    props: ListModelDefinitionsRequest & {
      enablePagination: true;
    },
  ): Promise<ListModelDefinitionsResponse>;
  async listModelDefinitions(
    props: ListModelDefinitionsRequest & {
      enablePagination: false;
    },
  ): Promise<ModelDefinition[]>;
  async listModelDefinitions(
    props: ListModelDefinitionsRequest & {
      enablePagination: boolean;
    },
  ): Promise<ListModelDefinitionsResponse | ModelDefinition[]>;
  async listModelDefinitions(
    props: ListModelDefinitionsRequest & {
      enablePagination: boolean;
    },
  ) {
    const { pageSize, view, pageToken, enablePagination } = props;

    try {
      const modelDefinitions: ModelDefinition[] = [];

      const queryString = getQueryString({
        baseURL: "/model-definitions?view=VIEW_FULL",
        pageSize,
        pageToken,
        view,
      });

      const data =
        await this._client.get<ListModelDefinitionsResponse>(queryString);

      if (enablePagination) {
        return Promise.resolve(data);
      }

      modelDefinitions.push(...data.modelDefinitions);

      if (data.nextPageToken) {
        modelDefinitions.push(
          ...(await this.listModelDefinitions({
            pageSize,
            pageToken: data.nextPageToken,
            enablePagination,
            view,
          })),
        );
      }

      return Promise.resolve(modelDefinitions);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getModelDefinition({ modelDefinitionName }: GetModelDefinitionRequest) {
    try {
      const data = await this._client.get<GetModelDefinitionResponse>(
        `/${modelDefinitionName}`,
      );

      return Promise.resolve(data.modelDefinition);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async listAvailableRegion() {
    try {
      const data =
        await this._client.get<ListAvailableRegionResponse>(
          "/available-regions",
        );
      return Promise.resolve(data.regions);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async listAccessibleModels(
    props: ListAccessibleModelsRequest & {
      enablePagination: true;
    },
  ): Promise<ListAccessibleModelsResponse>;
  async listAccessibleModels(
    props: ListAccessibleModelsRequest & {
      enablePagination: false;
    },
  ): Promise<Model[]>;
  async listAccessibleModels(
    props: ListAccessibleModelsRequest & {
      enablePagination: boolean;
    },
  ): Promise<ListAccessibleModelsResponse | Model[]>;
  async listAccessibleModels(
    props: ListAccessibleModelsRequest & {
      enablePagination: boolean;
    },
  ) {
    const {
      pageSize,
      pageToken,
      view,
      orderBy,
      filter,
      visibility,
      enablePagination,
    } = props;

    try {
      const models: Model[] = [];

      const queryString = getQueryString({
        baseURL: "/models",
        pageSize,
        pageToken,
        visibility,
        filter,
        orderBy,
        view,
      });

      const data =
        await this._client.get<ListAccessibleModelsResponse>(queryString);

      if (enablePagination) {
        return Promise.resolve(data);
      }

      models.push(...data.models);

      if (data.nextPageToken) {
        models.push(
          ...(await this.listAccessibleModels({
            pageSize,
            pageToken: data.nextPageToken,
            enablePagination: false,
            filter,
            visibility,
            orderBy,
            view,
          })),
        );
      }

      return Promise.resolve(models);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getNamespaceModel({
    namespaceModelName,
    view,
  }: GetNamespaceModelRequest) {
    const queryString = getQueryString({
      baseURL: `/${namespaceModelName}`,
      view,
    });

    try {
      const data =
        await this._client.get<GetNamespaceModelResponse>(queryString);
      return Promise.resolve(data.model);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async listNamespaceModels(
    props: ListNamespaceModelsRequest & {
      enablePagination: true;
    },
  ): Promise<ListAccessibleModelsResponse>;
  async listNamespaceModels(
    props: ListNamespaceModelsRequest & {
      enablePagination: false;
    },
  ): Promise<Model[]>;
  async listNamespaceModels(
    props: ListNamespaceModelsRequest & {
      enablePagination: boolean;
    },
  ): Promise<ListAccessibleModelsResponse | Model[]>;
  async listNamespaceModels(
    props: ListNamespaceModelsRequest & {
      enablePagination: boolean;
    },
  ) {
    const {
      pageSize,
      pageToken,
      view,
      orderBy,
      filter,
      visibility,
      enablePagination,
    } = props;

    try {
      const models: Model[] = [];

      const queryString = getQueryString({
        baseURL: "/models",
        pageSize,
        pageToken,
        visibility,
        filter,
        orderBy,
        view,
      });

      const data =
        await this._client.get<ListNamespaceModelsResponse>(queryString);

      if (enablePagination) {
        return Promise.resolve(data);
      }

      models.push(...data.models);

      if (data.nextPageToken) {
        models.push(
          ...(await this.listAccessibleModels({
            pageSize,
            pageToken: data.nextPageToken,
            enablePagination: false,
            filter,
            visibility,
            orderBy,
            view,
          })),
        );
      }

      return Promise.resolve(models);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getNamespaceModelReadme({
    namespaceModelName,
  }: GetNamespaceModelReadmeRequest) {
    try {
      const data = await this._client.get<GetNamespaceModelReadmeResponse>(
        `/${namespaceModelName}/readme`,
      );

      return Promise.resolve(data.readme);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async watchNamespaceModelVersionState({
    namespaceModelVersionName,
  }: WatchNamespaceModelVersionStateRequest) {
    try {
      const data =
        await this._client.get<WatchNamespaceModelVersionStateResponse>(
          `/${namespaceModelVersionName}/watch`,
        );

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async watchNamespaceModelLatestVersionState({
    namespaceModelName,
  }: WatchNamespaceModelLatestVersionStateRequest) {
    try {
      const data =
        await this._client.get<WatchNamespaceModelLatestVersionStateResponse>(
          `/${namespaceModelName}/watch`,
        );

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async listNamespaceModelVersions(
    props: ListNamespaceModelVersionsRequest & { enablePagination: true },
  ): Promise<ListNamespaceModelVersionsResponse>;
  async listNamespaceModelVersions(
    props: ListNamespaceModelVersionsRequest & { enablePagination: false },
  ): Promise<ModelVersion[]>;
  async listNamespaceModelVersions(
    props: ListNamespaceModelVersionsRequest & { enablePagination: undefined },
  ): Promise<ModelVersion[]>;
  async listNamespaceModelVersions(
    props: ListNamespaceModelVersionsRequest & { enablePagination?: boolean },
  ): Promise<ListNamespaceModelVersionsResponse | ModelVersion[]>;
  async listNamespaceModelVersions(
    props: ListNamespaceModelVersionsRequest & { enablePagination?: boolean },
  ) {
    const { namespaceModelName, pageSize, page, enablePagination } = props;

    try {
      const versions: ModelVersion[] = [];
      const queryString = getQueryString({
        baseURL: `/${namespaceModelName}/versions`,
        pageSize,
        queryParams: page ? `page=${page}` : undefined,
      });

      const data =
        await this._client.get<ListNamespaceModelVersionsResponse>(queryString);

      if (enablePagination) {
        return Promise.resolve(data);
      }

      versions.push(...data.versions);

      const lastPage = Math.ceil(data.totalSize / data.pageSize) - 1;

      if (data.page < lastPage) {
        versions.push(
          ...(await this.listNamespaceModelVersions({
            namespaceModelName,
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
   * List Model Runs
   * -----------------------------------------------------------------------*/

  async listModelRunsQuery({
    modelName,
    fullView,
    pageSize,
    page,
    orderBy,
    filter,
  }: ListModelRunsRequest) {
    try {
      const queryString = getQueryString({
        baseURL: `${modelName}/runs${fullView ? "?view=VIEW_FULL" : ""}`,
        pageSize,
        page,
        filter,
        orderBy,
      });

      const data = await this._client.get<ListModelRunsResponse>(queryString);

      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /* ----------------------------------------------------------------------------
   * Mutation
   * ---------------------------------------------------------------------------*/

  async createNamespaceModel(props: CreateNamespaceModelRequest) {
    const { namespaceName, ...payload } = props;

    try {
      const data = await this._client.post<CreateNamespaceModelResponse>(
        `/${namespaceName}/models`,
        {
          body: JSON.stringify(payload),
        },
      );

      return Promise.resolve(data.model);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteNamespaceModel({
    namespaceModelName,
  }: DeleteNamespaceModelRequest) {
    try {
      await this._client.delete(`/${namespaceModelName}`);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateNamespaceModel(props: UpdateNamespaceModelRequest) {
    const { namespaceModelName, ...payload } = props;

    try {
      const data = await this._client.patch<UpdateNamespaceModelResponse>(
        `/${namespaceModelName}`,
        {
          body: JSON.stringify(payload),
        },
      );

      return Promise.resolve(data.model);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async renameNamespaceModel({
    namespaceModelName,
    newModelId,
  }: RenameNamespaceModelRequest) {
    try {
      const data = await this._client.patch<RenameNamespaceModelResponse>(
        `/${namespaceModelName}/rename`,
        {
          body: JSON.stringify({
            newModelId,
          }),
        },
      );

      return Promise.resolve(data.model);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async publishNamespaceModel({
    namespaceModelName,
  }: PublishNamespaceModelRequest) {
    try {
      const data = await this._client.patch<PublishNamespaceModelResponse>(
        `/${namespaceModelName}/publish`,
      );

      return Promise.resolve(data.model);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async unPublishNamespaceModel({
    namespaceModelName,
  }: UnPublishNamespaceModelRequest) {
    try {
      const data = await this._client.patch<UnPublishNamespaceModelResponse>(
        `/${namespaceModelName}/unpublish`,
      );

      return Promise.resolve(data.model);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteNamespaceModelVersion({
    namespaceModelVersionName,
  }: DeleteNamespaceModelVersionRequest) {
    try {
      await this._client.delete(`/${namespaceModelVersionName}`);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async triggerNamespaceModelVersion({
    namespaceModelVersionName,
    taskInputs,
  }: TriggerNamespaceModelVersionRequest) {
    try {
      const data =
        await this._client.post<TriggerNamespaceModelVersionResponse>(
          `/${namespaceModelVersionName}/trigger`,
          {
            body: JSON.stringify({ taskInputs }),
          },
        );
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async triggerAsyncNamespaceModelVersion({
    namespaceModelVersionName,
    taskInputs,
    requesterUid,
    returnTraces,
  }: TriggerAsyncNamespaceModelVersionRequest) {
    try {
      const additionalHeaders = getInstillAdditionalHeaders({
        requesterUid,
        returnTraces,
      });

      const data =
        await this._client.post<TriggerNamespaceModelVersionResponse>(
          `/${namespaceModelVersionName}/trigger-async`,
          {
            body: JSON.stringify({ taskInputs }),
            additionalHeaders: {
              "Content-Type": "application/json",
              ...additionalHeaders,
            },
          },
        );
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async triggerNamespaceModelLatestVersion({
    namespaceModelName,
    taskInputs,
  }: TriggerNamespaceModelLatestVersionRequest) {
    try {
      const data =
        await this._client.post<TriggerNamespaceModelLatestVersionResponse>(
          `/${namespaceModelName}/trigger`,
          {
            body: JSON.stringify({ taskInputs }),
          },
        );
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async triggerAsyncNamespaceModelLatestVersion({
    namespaceModelName,
    taskInputs,
  }: TriggerAsyncNamespaceModelLatestVersionRequest) {
    try {
      const data =
        await this._client.post<TriggerNamespaceModelVersionResponse>(
          `/${namespaceModelName}/trigger-async`,
          {
            body: JSON.stringify({ taskInputs }),
          },
        );
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
