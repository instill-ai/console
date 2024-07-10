import { getQueryString } from "../../helper";
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
      enablePagination: boolean;
    },
  ): Promise<ListAccessiblePipelineResponse | Pipeline[]>;
  async listAccessiblePipelines(
    props: ListAccessiblePipelinesRequest & {
      enablePagination: boolean;
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
            enablePagination,
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
    pipelineName,
    view,
    shareCode,
  }: GetNamespacePipelineRequest) {
    try {
      const queryString = getQueryString({
        baseURL: `/${pipelineName}`,
        view,
      });

      const data = await this._client.get<GetNamespacePipelineResponse>(
        queryString,
        {
          additionalHeaders: {
            "instill-share-code": shareCode,
            "Access-Control-Allow-Headers": shareCode
              ? "instill-share-code"
              : undefined,
          },
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
    pipelineName,
  }: DeleteNamespacePipelineRequest) {
    try {
      await this._client.delete(`/${pipelineName}`);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateNamespacePipeline(props: UpdateNamespacePipelineRequest) {
    const { pipelineName, ...payload } = props;

    try {
      const data = await this._client.patch<UpdateNamespacePipelineResponse>(
        `/${pipelineName}`,
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
    pipelineName,
  }: ValidateNamespacePipelineRequest) {
    try {
      const data = await this._client.post<ValidateNamespacePipelineResponse>(
        `/${pipelineName}/validate`,
      );
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async renameNamespacePipeline({
    pipelineName,
    newPipelineId,
  }: RenameNamespacePipelineRequest) {
    try {
      const data = await this._client.post<RenameNamespacePipelineResponse>(
        `/${pipelineName}/rename`,
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
    const { pipelineName, ...payload } = props;

    try {
      await this._client.post(`/${pipelineName}/clone`, {
        body: JSON.stringify(payload),
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async cloneNamespacePipelineRelease(
    props: CloneNamespacePipelineReleaseRequest,
  ) {
    const { pipelineReleaseName, ...payload } = props;

    try {
      await this._client.post(`/${pipelineReleaseName}/clone`, {
        body: JSON.stringify(payload),
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
