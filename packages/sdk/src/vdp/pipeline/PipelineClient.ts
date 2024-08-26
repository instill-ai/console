import { getInstillAdditionalHeaders, getQueryString } from "../../helper";
import { APIResource } from "../../main/resource";
import {
  CloneNamespacePipelineReleaseRequest,
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
  ListPaginatedNamespacePipelineRunComponentsRequest,
  ListPaginatedNamespacePipelineRunComponentsResponse,
  ListPaginatedNamespacePipelineRunsRequest,
  ListPaginatedNamespacePipelineRunsResponse,
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
          })),
        );
      }

      return Promise.resolve(pipelines);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async listPaginatedNamespacePipelineRuns(
    props: ListPaginatedNamespacePipelineRunsRequest,
  ) {
    const { pipelineName, view, pageSize, page, orderBy, filter } = props;

    try {
      const queryString = getQueryString({
        baseURL: `/${pipelineName}/runs`,
        pageSize,
        page,
        filter,
        orderBy,
        view,
      });

      const data =
        await this._client.get<ListPaginatedNamespacePipelineRunsResponse>(
          queryString,
        );

      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async listPaginatedNamespacePipelineRunComponents(
    props: ListPaginatedNamespacePipelineRunComponentsRequest,
  ) {
    const { pipelineRunId, view, pageSize, page, orderBy, filter } = props;

    try {
      const queryString = getQueryString({
        baseURL: `/pipeline-runs/${pipelineRunId}/component-runs`,
        pageSize,
        page,
        filter,
        orderBy,
        view,
      });

      const data =
        await this._client.get<ListPaginatedNamespacePipelineRunComponentsResponse>(
          queryString,
        );

      return Promise.resolve(data);
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
      namespaceName,
      enablePagination,
      filter,
      visibility,
      view,
    } = props;

    try {
      const pipelines: Pipeline[] = [];

      const queryString = getQueryString({
        baseURL: `/${namespaceName}/pipelines`,
        pageSize,
        pageToken,
        visibility,
        filter,
        view,
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
            namespaceName,
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
    namespacePipelineName,
    view,
    shareCode,
  }: GetNamespacePipelineRequest) {
    try {
      const queryString = getQueryString({
        baseURL: `/${namespacePipelineName}`,
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
    const { namespaceName, ...payload } = props;

    try {
      const data = await this._client.post<CreateNamespacePipelineResponse>(
        `/${namespaceName}/pipelines`,
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
    namespacePipelineName,
  }: DeleteNamespacePipelineRequest) {
    try {
      await this._client.delete(`/${namespacePipelineName}`);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateNamespacePipeline(props: UpdateNamespacePipelineRequest) {
    const { namespacePipelineName, ...payload } = props;

    try {
      const data = await this._client.patch<UpdateNamespacePipelineResponse>(
        `/${namespacePipelineName}`,
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
    namespacePipelineName,
  }: ValidateNamespacePipelineRequest) {
    try {
      const data = await this._client.post<ValidateNamespacePipelineResponse>(
        `/${namespacePipelineName}/validate`,
      );
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async renameNamespacePipeline({
    namespacePipelineName,
    newPipelineId,
  }: RenameNamespacePipelineRequest) {
    try {
      const data = await this._client.post<RenameNamespacePipelineResponse>(
        `/${namespacePipelineName}/rename`,
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
    const { namespacePipelineName, ...payload } = props;

    try {
      await this._client.post(`/${namespacePipelineName}/clone`, {
        body: JSON.stringify(payload),
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async cloneNamespacePipelineRelease(
    props: CloneNamespacePipelineReleaseRequest,
  ) {
    const { namespacePipelineReleaseName, ...payload } = props;

    try {
      await this._client.post(`/${namespacePipelineReleaseName}/clone`, {
        body: JSON.stringify(payload),
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
