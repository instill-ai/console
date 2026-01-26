import { getInstillAdditionalHeaders, getQueryString } from "../helper";
import { APIResource } from "../main/resource";
import {
  CreateNamespaceModelRequest,
  CreateNamespaceModelResponse,
  DeleteNamespaceModelRequest,
  DeleteNamespaceModelVersionRequest,
  GetModelDefinitionRequest,
  GetModelDefinitionResponse,
  GetNamespaceModelOperationResultRequest,
  GetNamespaceModelOperationResultResponse,
  GetNamespaceModelReadmeRequest,
  GetNamespaceModelReadmeResponse,
  GetNamespaceModelRequest,
  GetNamespaceModelResponse,
  GetNamespaceModelVersionOperationResultRequest,
  ListAvailableRegionResponse,
  ListModelDefinitionsRequest,
  ListModelDefinitionsResponse,
  ListModelRunsByRequesterRequest,
  ListModelRunsByRequesterResponse,
  ListModelRunsRequest,
  ListModelRunsResponse,
  ListModelsRequest,
  ListModelsResponse,
  ListNamespaceModelsRequest,
  ListNamespaceModelsResponse,
  ListNamespaceModelVersionsRequest,
  ListNamespaceModelVersionsResponse,
  Model,
  ModelDefinition,
  ModelRun,
  ModelVersion,
  PublishNamespaceModelRequest,
  PublishNamespaceModelResponse,
  RenameNamespaceModelRequest,
  RenameNamespaceModelResponse,
  TriggerAsyncNamespaceModelLatestVersionRequest,
  TriggerAsyncNamespaceModelVersionRequest,
  TriggerAsyncNamespaceModelVersionResponse,
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

  async listModels(
    props: ListModelsRequest & {
      enablePagination: true;
    },
  ): Promise<ListModelsResponse>;
  async listModels(
    props: ListModelsRequest & {
      enablePagination: false;
    },
  ): Promise<Model[]>;
  async listModels(
    props: ListModelsRequest & {
      enablePagination: boolean;
    },
  ): Promise<ListModelsResponse | Model[]>;
  async listModels(
    props: ListModelsRequest & {
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

      const data = await this._client.get<ListModelsResponse>(queryString);

      if (enablePagination) {
        return Promise.resolve(data);
      }

      models.push(...data.models);

      if (data.nextPageToken) {
        models.push(
          ...(await this.listModels({
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

  async listModelRunsByRequester(
    props: ListModelRunsByRequesterRequest & { enablePagination: true },
  ): Promise<ListModelRunsByRequesterResponse>;

  async listModelRunsByRequester(
    props: ListModelRunsByRequesterRequest & { enablePagination: false },
  ): Promise<ModelRun[]>;

  async listModelRunsByRequester(
    props: ListModelRunsByRequesterRequest & { enablePagination?: boolean },
  ): Promise<ListModelRunsByRequesterResponse | ModelRun[]> {
    const {
      pageSize,
      page,
      orderBy,
      enablePagination,
      requesterUid,
      requesterId,
      start,
    } = props;

    const additionalHeaders = getInstillAdditionalHeaders({
      requesterUid,
    });

    try {
      const queryString = getQueryString({
        baseURL: `/dashboard/models/runs`,
        pageSize,
        page,
        orderBy,
        requesterId,
        start,
      });

      const data = await this._client.get<ListModelRunsByRequesterResponse>(
        queryString,
        {
          additionalHeaders,
        },
      );

      if (enablePagination) {
        return Promise.resolve(data);
      }

      return Promise.resolve(data.runs);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getNamespaceModel({
    namespaceId,
    modelId,
    view,
  }: GetNamespaceModelRequest) {
    const queryString = getQueryString({
      baseURL: `/namespaces/${namespaceId}/models/${modelId}`,
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
  ): Promise<ListNamespaceModelsResponse>;
  async listNamespaceModels(
    props: ListNamespaceModelsRequest & {
      enablePagination: false;
    },
  ): Promise<Model[]>;
  async listNamespaceModels(
    props: ListNamespaceModelsRequest & {
      enablePagination: boolean;
    },
  ): Promise<ListNamespaceModelsResponse | Model[]>;
  async listNamespaceModels(
    props: ListNamespaceModelsRequest & {
      enablePagination: boolean;
    },
  ) {
    const {
      namespaceId,
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
        baseURL: `/namespaces/${namespaceId}/models`,
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
          ...(await this.listNamespaceModels({
            namespaceId,
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
    namespaceId,
    modelId,
  }: WatchNamespaceModelLatestVersionStateRequest) {
    try {
      const data =
        await this._client.get<WatchNamespaceModelLatestVersionStateResponse>(
          `/namespaces/${namespaceId}/models/${modelId}/watch`,
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
    const { namespaceId, modelId, pageSize, page, enablePagination } = props;

    try {
      const versions: ModelVersion[] = [];
      const queryString = getQueryString({
        baseURL: `/namespaces/${namespaceId}/models/${modelId}/versions`,
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
            namespaceId,
            modelId,
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

  async listModelRuns({
    namespaceId,
    modelId,
    view,
    pageSize,
    page,
    orderBy,
    filter,
    requesterUid,
  }: ListModelRunsRequest) {
    try {
      const queryString = getQueryString({
        baseURL: `/namespaces/${namespaceId}/models/${modelId}/runs`,
        pageSize,
        page,
        filter,
        orderBy,
        view,
      });

      const additionalHeaders = getInstillAdditionalHeaders({ requesterUid });

      const data = await this._client.get<ListModelRunsResponse>(queryString, {
        additionalHeaders,
      });

      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /* ----------------------------------------------------------------------------
   * Mutation
   * ---------------------------------------------------------------------------*/

  async createNamespaceModel(props: CreateNamespaceModelRequest) {
    const { namespaceId, ...payload } = props;

    try {
      const data = await this._client.post<CreateNamespaceModelResponse>(
        `/namespaces/${namespaceId}/models`,
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
    namespaceId,
    modelId,
  }: DeleteNamespaceModelRequest) {
    try {
      await this._client.delete(`/namespaces/${namespaceId}/models/${modelId}`);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateNamespaceModel(props: UpdateNamespaceModelRequest) {
    const { namespaceId, modelId, ...payload } = props;

    try {
      const data = await this._client.patch<UpdateNamespaceModelResponse>(
        `/namespaces/${namespaceId}/models/${modelId}`,
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
      const data = await this._client.post<RenameNamespaceModelResponse>(
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
    isConsole,
  }: TriggerNamespaceModelVersionRequest) {
    const additionalHeaders = getInstillAdditionalHeaders({
      isConsole,
    });

    try {
      const data =
        await this._client.post<TriggerNamespaceModelVersionResponse>(
          `/${namespaceModelVersionName}/trigger`,
          {
            body: JSON.stringify({ taskInputs }),
            additionalHeaders,
          },
        );
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async triggerAsyncNamespaceModelVersion({
    namespaceId,
    modelId,
    versionId,
    taskInputs,
    requesterUid,
    returnTraces,
    isConsole,
  }: TriggerAsyncNamespaceModelVersionRequest) {
    try {
      const additionalHeaders = getInstillAdditionalHeaders({
        requesterUid,
        returnTraces,
        isConsole,
      });

      const data =
        await this._client.post<TriggerAsyncNamespaceModelVersionResponse>(
          `/namespaces/${namespaceId}/models/${modelId}/versions/${versionId}/trigger-async`,
          {
            body: JSON.stringify({ taskInputs }),
            additionalHeaders,
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

  /* -------------------------------------------------------------------------
   * Get Model Trigger Result
   * -----------------------------------------------------------------------*/

  async getNamespaceModelOperationResult({
    namespaceId,
    modelId,
    view,
    requesterUid,
  }: GetNamespaceModelOperationResultRequest) {
    try {
      const queryString = getQueryString({
        baseURL: `/namespaces/${namespaceId}/models/${modelId}/operation`,
        view,
      });

      const additionalHeaders = getInstillAdditionalHeaders({ requesterUid });

      const data =
        await this._client.get<GetNamespaceModelOperationResultResponse>(
          queryString,
          {
            additionalHeaders,
          },
        );

      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getNamespaceModelVersionOperationResult({
    namespaceId,
    modelId,
    versionId,
    view,
    requesterUid,
  }: GetNamespaceModelVersionOperationResultRequest) {
    try {
      const queryString = getQueryString({
        baseURL: `/namespaces/${namespaceId}/models/${modelId}/versions/${versionId}/operation`,
        view,
      });

      const additionalHeaders = getInstillAdditionalHeaders({ requesterUid });

      const data =
        await this._client.get<GetNamespaceModelOperationResultResponse>(
          queryString,
          {
            additionalHeaders,
          },
        );

      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
