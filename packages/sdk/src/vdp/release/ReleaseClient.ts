import { getInstillAdditionalHeaders, getQueryString } from "../../helper";
import { APIResource } from "../../main/resource";
import {
  CloneNamespacePipelineReleaseRequest,
  CreateNamespacePipelineReleaseRequest,
  CreateNamespacePipelineReleaseResponse,
  DeleteNamespacePipelineReleaseRequest,
  GetNamespacePipelineReleaseRequest,
  GetNamespacePipelineReleaseResponse,
  ListNamespacePipelineReleaseRequest,
  ListNamespacePipelineReleaseResponse,
  PipelineRelease,
  UpdateNamespacePipelineReleaseRequest,
  UpdateNamespacePipelineReleaseResponse,
} from "./types";

export class ReleaseClient extends APIResource {
  /* ----------------------------------------------------------------------------
   * Query
   * ---------------------------------------------------------------------------*/

  async GetNamespacePipelineRelease({
    namespaceId,
    pipelineId,
    releaseId,
    view,
  }: GetNamespacePipelineReleaseRequest) {
    const queryString = getQueryString({
      baseURL: `/namespaces/${namespaceId}/pipelines/${pipelineId}/releases/${releaseId}`,
      view,
    });

    try {
      const data =
        await this._client.get<GetNamespacePipelineReleaseResponse>(
          queryString,
        );

      return Promise.resolve(data.release);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async listNamespacePipelineReleases(
    props: ListNamespacePipelineReleaseRequest & {
      enablePagination: true;
    },
  ): Promise<ListNamespacePipelineReleaseResponse>;
  async listNamespacePipelineReleases(
    props: ListNamespacePipelineReleaseRequest & {
      enablePagination: false;
    },
  ): Promise<PipelineRelease[]>;
  async listNamespacePipelineReleases(
    props: ListNamespacePipelineReleaseRequest & {
      enablePagination: undefined;
    },
  ): Promise<PipelineRelease[]>;
  async listNamespacePipelineReleases(
    props: ListNamespacePipelineReleaseRequest & {
      enablePagination?: boolean;
    },
  ): Promise<ListNamespacePipelineReleaseResponse | PipelineRelease[]>;
  async listNamespacePipelineReleases(
    props: ListNamespacePipelineReleaseRequest & { enablePagination?: boolean },
  ) {
    const {
      namespaceId,
      pipelineId,
      pageSize,
      pageToken,
      shareCode,
      view,
      filter,
      enablePagination,
    } = props;

    try {
      const releases: PipelineRelease[] = [];

      const queryString = getQueryString({
        baseURL: `/namespaces/${namespaceId}/pipelines/${pipelineId}/releases`,
        pageSize,
        pageToken,
        view,
        filter,
      });

      const additionalHeaders = getInstillAdditionalHeaders({
        shareCode,
      });

      const data = await this._client.get<ListNamespacePipelineReleaseResponse>(
        queryString,
        {
          additionalHeaders,
        },
      );

      if (enablePagination) {
        return Promise.resolve(data);
      }

      releases.push(...data.releases);

      if (data.nextPageToken) {
        releases.push(
          ...(await this.listNamespacePipelineReleases({
            namespaceId,
            pipelineId,
            pageSize,
            pageToken: data.nextPageToken,
            shareCode,
            view,
            filter,
            enablePagination: false,
          })),
        );
      }

      return Promise.resolve(releases);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /* ----------------------------------------------------------------------------
   * Mutation
   * ---------------------------------------------------------------------------*/

  async createNamespacePipelineRelease(
    props: CreateNamespacePipelineReleaseRequest,
  ) {
    const { namespaceId, pipelineId, ...payload } = props;

    try {
      const data =
        await this._client.post<CreateNamespacePipelineReleaseResponse>(
          `/namespaces/${namespaceId}/pipelines/${pipelineId}/releases`,
          {
            body: JSON.stringify(payload),
          },
        );

      return Promise.resolve(data.release);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteNamespacePipelineRelease({
    namespaceId,
    pipelineId,
    releaseId,
  }: DeleteNamespacePipelineReleaseRequest) {
    try {
      await this._client.delete(
        `/namespaces/${namespaceId}/pipelines/${pipelineId}/releases/${releaseId}`,
      );

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateNamespacePipelineRelease(
    props: UpdateNamespacePipelineReleaseRequest,
  ) {
    const { namespaceId, pipelineId, releaseId, ...payload } = props;

    try {
      const data =
        await this._client.patch<UpdateNamespacePipelineReleaseResponse>(
          `/namespaces/${namespaceId}/pipelines/${pipelineId}/releases/${releaseId}`,
          {
            body: JSON.stringify(payload),
          },
        );

      return Promise.resolve(data.release);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async cloneNamespacePipelineRelease(
    props: CloneNamespacePipelineReleaseRequest,
  ) {
    const { namespaceId, pipelineId, releaseId, ...payload } = props;

    try {
      await this._client.post(
        `/namespaces/${namespaceId}/pipelines/${pipelineId}/releases/${releaseId}/clone`,
        {
          body: JSON.stringify(payload),
        },
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
