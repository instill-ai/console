import { getInstillAdditionalHeaders, getQueryString } from "../../helper";
import { APIResource } from "../../main/resource";
import {
  CloneNamespacePipelineRequest,
  CreateNamespacePipelineRequest,
  CreateNamespacePipelineResponse,
  DeleteNamespacePipelineRequest,
  GetNamespacePipelineRequest,
  GetNamespacePipelineResponse,
  HubStatsResponse,
  ListAccessiblePipelineResponse,
  ListAccessiblePipelinesRequest,
  ListNamespacePipelinesRequest,
  ListNamespacePipelinesResponse,
  Pipeline,
  RenameNamespacePipelineRequest,
  RenameNamespacePipelineResponse,
  UpdateNamespacePipelineRequest,
  UpdateNamespacePipelineResponse,
  ValidateNamespacePipelineRequest,
  ValidateNamespacePipelineResponse,
} from "./types";

export class PipelineClient extends APIResource {
  /* ----------------------------------------------------------------------------
   * Query
   * ---------------------------------------------------------------------------*/

  async getHubStats() {
    try {
      const data = await this._client.get<HubStatsResponse>("/hub/stats");
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async listAccessiblePipelines(
    props: ListAccessiblePipelinesRequest & {
      enablePagination: true;
    },
  ): Promise<ListAccessiblePipelineResponse>;
  async listAccessiblePipelines(
    props: ListAccessiblePipelinesRequest & {
      enablePagination: false;
    },
  ): Promise<Pipeline[]>;
  async listAccessiblePipelines(
    props: ListAccessiblePipelinesRequest & {
      enablePagination: undefined;
    },
  ): Promise<Pipeline[]>;
  async listAccessiblePipelines(
    props: ListAccessiblePipelinesRequest & {
      enablePagination?: boolean;
    },
  ): Promise<ListAccessiblePipelineResponse | Pipeline[]>;
  async listAccessiblePipelines(
    props: ListAccessiblePipelinesRequest & {
      enablePagination?: boolean;
    },
  ) {
    const {
      pageSize,
      pageToken,
      enablePagination,
      visibility,
      filter,
      orderBy,
      view,
      showDeleted,
    } = props;

    try {
      const pipelines: Pipeline[] = [];

      const queryString = getQueryString({
        baseURL: "/pipelines",
        pageSize,
        pageToken,
        filter,
        orderBy,
        view,
        visibility,
        showDeleted,
      });

      const data =
        await this._client.get<ListAccessiblePipelineResponse>(queryString);

      if (enablePagination) {
        return Promise.resolve(data);
      }

      pipelines.push(...data.pipelines);

      if (data.nextPageToken) {
        pipelines.push(
          ...(await this.listAccessiblePipelines({
            pageSize,
            pageToken: data.nextPageToken,
            enablePagination: false,
            filter,
            visibility,
            orderBy,
            view,
            showDeleted,
          })),
        );
      }

      return Promise.resolve(pipelines);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async listNamespacePipelines(
    props: ListNamespacePipelinesRequest & {
      enablePagination: true;
    },
  ): Promise<ListNamespacePipelinesResponse>;
  async listNamespacePipelines(
    props: ListNamespacePipelinesRequest & {
      enablePagination: false;
    },
  ): Promise<Pipeline[]>;
  async listNamespacePipelines(
    props: ListNamespacePipelinesRequest & {
      enablePagination: boolean;
    },
  ): Promise<ListNamespacePipelinesResponse | Pipeline[]>;
  async listNamespacePipelines(
    props: ListNamespacePipelinesRequest & {
      enablePagination: boolean;
    },
  ) {
    const {
      pageSize,
      pageToken,
      namespaceId,
      enablePagination,
      filter,
      visibility,
      view,
      showDeleted,
      orderBy,
    } = props;

    try {
      const pipelines: Pipeline[] = [];

      const queryString = getQueryString({
        baseURL: `/namespaces/${namespaceId}/pipelines`,
        pageSize,
        pageToken,
        visibility,
        filter,
        view,
        showDeleted,
        orderBy,
      });

      const data =
        await this._client.get<ListNamespacePipelinesResponse>(queryString);

      if (enablePagination) {
        return Promise.resolve(data);
      }

      pipelines.push(...data.pipelines);

      if (data.nextPageToken) {
        pipelines.push(
          ...(await this.listNamespacePipelines({
            pageSize,
            pageToken: data.nextPageToken,
            namespaceId,
            enablePagination,
            filter,
            visibility,
            view,
          })),
        );
      }

      return Promise.resolve(pipelines);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getNamespacePipeline({
    namespaceId,
    pipelineId,
    view,
    shareCode,
  }: GetNamespacePipelineRequest) {
    try {
      const queryString = getQueryString({
        baseURL: `/namespaces/${namespaceId}/pipelines/${pipelineId}`,
        view,
      });

      const additionalHeaders = getInstillAdditionalHeaders({
        shareCode,
      });

      const data = await this._client.get<GetNamespacePipelineResponse>(
        queryString,
        {
          additionalHeaders,
        },
      );

      return Promise.resolve(data.pipeline);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /* ----------------------------------------------------------------------------
   * Mutation
   * ---------------------------------------------------------------------------*/

  async createNamespacePipeline(props: CreateNamespacePipelineRequest) {
    const { namespaceId, ...payload } = props;

    try {
      const data = await this._client.post<CreateNamespacePipelineResponse>(
        `/namespaces/${namespaceId}/pipelines`,
        {
          body: JSON.stringify(payload),
        },
      );

      return Promise.resolve(data.pipeline);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteNamespacePipeline({
    namespaceId,
    pipelineId,
  }: DeleteNamespacePipelineRequest) {
    try {
      await this._client.delete(
        `/namespaces/${namespaceId}/pipelines/${pipelineId}`,
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateNamespacePipeline(props: UpdateNamespacePipelineRequest) {
    const { namespaceId, pipelineId, ...payload } = props;

    try {
      const data = await this._client.patch<UpdateNamespacePipelineResponse>(
        `/namespaces/${namespaceId}/pipelines/${pipelineId}`,
        {
          body: JSON.stringify(payload),
        },
      );
      return Promise.resolve(data.pipeline);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async validateNamespacePipeline({
    namespaceId,
    pipelineId,
  }: ValidateNamespacePipelineRequest) {
    try {
      const data = await this._client.post<ValidateNamespacePipelineResponse>(
        `/namespaces/${namespaceId}/pipelines/${pipelineId}/validate`,
      );
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async renameNamespacePipeline({
    namespaceId,
    pipelineId,
    newPipelineId,
  }: RenameNamespacePipelineRequest) {
    try {
      const data = await this._client.post<RenameNamespacePipelineResponse>(
        `/namespaces/${namespaceId}/pipelines/${pipelineId}/rename`,
        {
          body: JSON.stringify({ newPipelineId }),
        },
      );
      return Promise.resolve(data.pipeline);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async cloneNamespacePipeline(props: CloneNamespacePipelineRequest) {
    const { namespaceId, pipelineId, ...payload } = props;

    try {
      await this._client.post(
        `/namespaces/${namespaceId}/pipelines/${pipelineId}/clone`,
        {
          body: JSON.stringify(payload),
        },
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
